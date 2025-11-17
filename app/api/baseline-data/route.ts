import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    // Read the 
    const filePath = join(process.cwd(), "Monthly Loan Reports-Premier Credit.xlsx");
    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Find the "Baseline Data (1st Loan)" sheet
    const sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("baseline") || name.toLowerCase().includes("1st loan")
    );

    if (!sheetName) {
      return NextResponse.json(
        { error: "Baseline Data (1st Loan) sheet not found" },
        { status: 404 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

    // Find header row (usually first row)
    const headerRow = data[0] || [];
    
    // Find column indices (Excel columns: A=0, B=1, C=2, etc.)
    // COL C = index 2, COL G = index 6, COL O = index 14, COL Q = index 16, COL R = index 17, COL S = index 18, COL AQ = index 42
    const colC = 2; // Total Number of Schools
    const colG = 6; // School Proprietor Gender
    const colO = 14; // Dignitas Training Participation
    const colQ = 16; // Boys
    const colR = 17; // Girls
    const colS = 18; // Total Student Reach
    
    // Find Annual Fees column from header row
    let colAQ = 42; // Default to AQ
    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i] || "").toLowerCase().trim();
      if (header.includes("annual fee") || header.includes("tuition") || (header.includes("fee") && header.includes("annual"))) {
        colAQ = i;
        console.log(`Found Annual Fees column at index ${i} (header: "${headerRow[i]}")`);
        break;
      }
    }

    // Process data rows (skip header)
    let totalSchools = 0;
    let femaleProprietors = 0;
    let maleProprietors = 0;
    let trainingYes = 0;
    let trainingNo = 0;
    let totalBoys = 0;
    let totalGirls = 0;
    let totalStudentReach = 0;
    const tuitionFees: number[] = [];

    // Count valid rows for debugging
    let validRows = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }
      
      validRows++;
      
      // Total Number of Schools: COUNT valid rows (each row represents one school in baseline form)
      // Count each valid row as 1 school
      totalSchools += 1;

      // School Proprietor Gender: COL G
      if (row[colG] !== null && row[colG] !== undefined && row[colG] !== "") {
        const gender = String(row[colG]).toUpperCase().trim();
        if (gender === "FEMALE" || gender === "F") {
          femaleProprietors++;
        } else if (gender === "MALE" || gender === "M") {
          maleProprietors++;
        }
      }

      // Dignitas Training Participation: COL O
      if (row[colO] !== null && row[colO] !== undefined && row[colO] !== "") {
        const participation = String(row[colO]).toUpperCase().trim();
        if (participation === "YES" || participation === "Y") {
          trainingYes++;
        } else if (participation === "NO" || participation === "N") {
          trainingNo++;
        }
      }

      // Boys: COL Q
      if (row[colQ] !== null && row[colQ] !== undefined && row[colQ] !== "") {
        const boys = Number(row[colQ]);
        if (!isNaN(boys)) {
          totalBoys += boys;
        }
      }

      // Girls: COL R
      if (row[colR] !== null && row[colR] !== undefined && row[colR] !== "") {
        const girls = Number(row[colR]);
        if (!isNaN(girls)) {
          totalGirls += girls;
        }
      }

      // Total Student Reach: COL S
      if (row[colS] !== null && row[colS] !== undefined && row[colS] !== "") {
        const students = Number(row[colS]);
        if (!isNaN(students)) {
          totalStudentReach += students;
        }
      }

      // Annual Fees: COL AQ
      // Try to find annual fees - check primary column first, then fallbacks
      let feeFound = false;
      
      // First, try the detected/default column (AQ = 42)
      if (row[colAQ] !== null && row[colAQ] !== undefined && row[colAQ] !== "") {
        const fee = Number(row[colAQ]);
        // Accept any positive number for the primary column
        if (!isNaN(fee) && fee > 0) {
          tuitionFees.push(fee);
          feeFound = true;
        }
      }
      
      // If primary column doesn't have data, try checking nearby columns (40-50)
      if (!feeFound) {
        for (let colIndex = 40; colIndex <= 50; colIndex++) {
          if (row[colIndex] !== null && row[colIndex] !== undefined && row[colIndex] !== "") {
            const fee = Number(row[colIndex]);
            // Check if it's a reasonable annual fee (between 1,000 and 500,000 KES)
            if (!isNaN(fee) && fee >= 1000 && fee <= 500000) {
              tuitionFees.push(fee);
              feeFound = true;
              break; // Only take first valid fee found in this range
            }
          }
        }
      }
      
      // Last resort: search columns 19-39 and 51+ for reasonable fee values
      if (!feeFound && row.length > 0) {
        for (let colIndex = 19; colIndex < Math.min(row.length, 100); colIndex++) {
          // Skip columns 40-50 (already checked above)
          if (colIndex >= 40 && colIndex <= 50) continue;
          
          if (row[colIndex] !== null && row[colIndex] !== undefined && row[colIndex] !== "") {
            const fee = Number(row[colIndex]);
            // Check if it's a reasonable annual fee (between 1,000 and 500,000 KES)
            if (!isNaN(fee) && fee >= 1000 && fee <= 500000) {
              tuitionFees.push(fee);
              feeFound = true;
              break; // Only take first valid fee found
            }
          }
        }
      }
    }

    // Calculate percentages
    const totalProprietors = femaleProprietors + maleProprietors;
    const femaleProprietorPercent = totalProprietors > 0 
      ? parseFloat(((femaleProprietors / totalProprietors) * 100).toFixed(2)) 
      : 0;
    const maleProprietorPercent = totalProprietors > 0 
      ? parseFloat(((maleProprietors / totalProprietors) * 100).toFixed(2)) 
      : 0;

    const totalTraining = trainingYes + trainingNo;
    const trainingYesPercent = totalTraining > 0 
      ? parseFloat(((trainingYes / totalTraining) * 100).toFixed(2)) 
      : 0;
    const trainingNoPercent = totalTraining > 0 
      ? parseFloat(((trainingNo / totalTraining) * 100).toFixed(2)) 
      : 0;

    const boysPercent = totalStudentReach > 0 
      ? parseFloat(((totalBoys / totalStudentReach) * 100).toFixed(2)) 
      : 0;
    const girlsPercent = totalStudentReach > 0 
      ? parseFloat(((totalGirls / totalStudentReach) * 100).toFixed(2)) 
      : 0;

    // Calculate tuition fee statistics
    // Filter out any invalid fees and ensure we have valid numbers
    // Also filter to reasonable range (1,000 to 500,000) to avoid picking up wrong columns
    const validFees = tuitionFees.filter(fee => 
      fee > 0 && 
      !isNaN(fee) && 
      isFinite(fee) &&
      fee >= 1000 &&  // At least 1,000 KES
      fee <= 500000   // At most 500,000 KES
    );
    
    const averageTuition = validFees.length > 0 
      ? Math.round(validFees.reduce((sum, fee) => sum + fee, 0) / validFees.length)
      : 0;
    const lowestTuition = validFees.length > 0 ? Math.min(...validFees) : 0;
    const maximumTuition = validFees.length > 0 ? Math.max(...validFees) : 0;
    
    console.log(`Fee statistics - Total fees found: ${tuitionFees.length}, Valid fees (1K-500K range): ${validFees.length}`);
    if (validFees.length > 0) {
      console.log(`Fee range: ${lowestTuition} - ${maximumTuition}, Average: ${averageTuition}`);
      console.log(`Sample fees (first 10):`, validFees.slice(0, 10));
    } else if (tuitionFees.length > 0) {
      console.log(`WARNING: Found ${tuitionFees.length} fees but none in valid range (1K-500K)`);
      console.log(`Sample fees found (may be out of range):`, tuitionFees.slice(0, 10));
    }

    // Calculate quartiles
    let quartile1 = 0;
    let quartile2 = 0;
    let quartile3 = 0;
    let quartile4 = 0;

    if (tuitionFees.length > 0) {
      const sortedFees = [...tuitionFees].sort((a, b) => a - b);
      const n = sortedFees.length;
      
      // Q1 (25th percentile)
      const q1Index = Math.floor(n * 0.25);
      quartile1 = sortedFees[q1Index] || 0;
      
      // Q2 (50th percentile / median)
      const q2Index = Math.floor(n * 0.5);
      quartile2 = sortedFees[q2Index] || 0;
      
      // Q3 (75th percentile)
      const q3Index = Math.floor(n * 0.75);
      quartile3 = sortedFees[q3Index] || 0;
      
      // Q4 (100th percentile / maximum)
      quartile4 = sortedFees[n - 1] || 0;
    }

    console.log(`Processed ${validRows} valid rows from sheet "${sheetName}"`);
    console.log(`Total Schools: ${totalSchools} (counted as ${validRows} valid rows), Student Reach: ${totalStudentReach}`);
    console.log(`Annual Fees found: ${tuitionFees.length} entries, Average: ${averageTuition}, Lowest: ${lowestTuition}, Maximum: ${maximumTuition}`);
    
    // Debug: Check sample row data for annual fees
    if (tuitionFees.length === 0 && data.length > 1) {
      console.log(`No annual fees found. Checking sample rows...`);
      console.log(`Using column index ${colAQ} for annual fees`);
      console.log(`Header row sample (columns 35-50):`, headerRow.slice(35, 51));
      for (let i = 1; i < Math.min(6, data.length); i++) {
        const row = data[i];
        if (row && !row.every(cell => cell === null || cell === undefined || cell === "")) {
          console.log(`Row ${i} - Column ${colAQ}:`, row[colAQ], `Columns 40-50:`, row.slice(40, 51));
        }
      }
    }

    return NextResponse.json({
      totalSchools,
      schoolProprietorGender: {
        female: femaleProprietorPercent,
        male: maleProprietorPercent,
        femaleCount: femaleProprietors,
        maleCount: maleProprietors,
      },
      dignitasTraining: {
        yes: trainingYesPercent,
        no: trainingNoPercent,
        yesCount: trainingYes,
        noCount: trainingNo,
      },
      studentReach: {
        total: totalStudentReach,
        boys: boysPercent,
        girls: girlsPercent,
        boysCount: totalBoys,
        girlsCount: totalGirls,
      },
      annualFees: {
        average: averageTuition,
        lowest: lowestTuition,
        maximum: maximumTuition,
        quartile1,
        quartile2,
        quartile3,
        quartile4,
      },
    });
  } catch (err) {
    console.error("Error parsing Excel file:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

