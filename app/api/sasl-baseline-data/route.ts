import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { join } from "path";

// Helper function to convert Excel column letter to index (e.g., "DO" -> 123)
function excelColumnToIndex(column: string): number {
  let index = 0;
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + (column.charCodeAt(i) - 64);
  }
  return index - 1; // Convert to 0-based index
}

export async function GET(req: NextRequest) {
  try {
    // Read the SASL Excel file
    const filePath = join(process.cwd(), "Monthly Loans Reports_SASL.xlsx");
    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Find the "Baseline Form" sheet
    const sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("baseline")
    );

    if (!sheetName) {
      return NextResponse.json(
        { error: "Baseline Form sheet not found" },
        { status: 404 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

    // Find header row (usually first row)
    const headerRow = data[0] || [];

    // Column indices (0-based): D=3, E=4, O=14, P=15, Q=16, DO=118
    const colD = 3; // Total Number of Schools
    const colE = 4; // School Proprietor Gender
    const colO = 14; // Boys
    const colP = 15; // Girls
    const colQ = 16; // Total Students
    
    // Find Annual Fees column from header row
    let colDO = excelColumnToIndex("DO"); // Default to DO (118)
    let isDollarAmount = false;
    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i] || "").toLowerCase().trim();
      if (header.includes("annual fee") || header.includes("tuition") || (header.includes("fee") && header.includes("annual"))) {
        colDO = i;
        // Check if the header indicates dollars
        isDollarAmount = header.includes("$") || header.includes("dollar") || header.includes("usd");
        console.log(`Found Annual Fees column at index ${i} (header: "${headerRow[i]}") - Is Dollar: ${isDollarAmount}`);
        break;
      }
    }
    
    console.log(`Column DO index: ${colDO}, Is Dollar Amount: ${isDollarAmount}`);

    // Process data rows (skip header)
    let totalSchools = 0;
    let femaleProprietors = 0;
    let maleProprietors = 0;
    let totalBoys = 0;
    let totalGirls = 0;
    let totalStudents = 0;
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

      // School Proprietor Gender: COL E
      if (row[colE] !== null && row[colE] !== undefined && row[colE] !== "") {
        const gender = String(row[colE]).toUpperCase().trim();
        if (gender === "FEMALE" || gender === "F") {
          femaleProprietors++;
        } else if (gender === "MALE" || gender === "M") {
          maleProprietors++;
        }
      }

      // Boys: COL O
      if (row[colO] !== null && row[colO] !== undefined && row[colO] !== "") {
        const boys = Number(row[colO]);
        if (!isNaN(boys)) {
          totalBoys += boys;
        }
      }

      // Girls: COL P
      if (row[colP] !== null && row[colP] !== undefined && row[colP] !== "") {
        const girls = Number(row[colP]);
        if (!isNaN(girls)) {
          totalGirls += girls;
        }
      }

      // Total Students: COL Q
      if (row[colQ] !== null && row[colQ] !== undefined && row[colQ] !== "") {
        const students = Number(row[colQ]);
        if (!isNaN(students)) {
          totalStudents += students;
        }
      }

      // Annual Fees: COL DO
      // Try to find annual fees - check primary column first, then fallbacks
      let feeFound = false;
      
      // First, try the detected/default column (DO = 118)
      if (row[colDO] !== null && row[colDO] !== undefined && row[colDO] !== "") {
        let feeValue = row[colDO];
        // Try to extract number if it's a string with currency or formatting
        if (typeof feeValue === 'string') {
          // Remove currency symbols, commas, and extract number
          feeValue = feeValue.replace(/[^\d.]/g, '');
        }
        let fee = Number(feeValue);
        // If it's in dollars, convert to KES (assuming 1 USD = 150 KES, adjust as needed)
        if (isDollarAmount && fee > 0) {
          fee = fee * 150; // Convert USD to KES
        }
        // Accept any positive number for the primary column (no range restriction initially)
        if (!isNaN(fee) && fee > 0) {
          tuitionFees.push(fee);
          feeFound = true;
        }
      }
      
      // If primary column doesn't have data, try checking nearby columns (40-50)
      if (!feeFound) {
        for (let colIndex = 40; colIndex <= 50; colIndex++) {
          if (row[colIndex] !== null && row[colIndex] !== undefined && row[colIndex] !== "") {
            let feeValue = row[colIndex];
            // Try to extract number if it's a string
            if (typeof feeValue === 'string') {
              feeValue = feeValue.replace(/[^\d.]/g, '');
            }
            const fee = Number(feeValue);
            // Check if it's a reasonable annual fee (between 1,000 and 500,000 KES)
            if (!isNaN(fee) && fee >= 1000 && fee <= 500000) {
              tuitionFees.push(fee);
              feeFound = true;
              break; // Only take first valid fee found in this range
            }
          }
        }
      }
      
      // Try AQ column (same as Premier Credit) as additional fallback
      if (!feeFound) {
        const colAQ = 42; // AQ column (same as Premier Credit)
        if (row[colAQ] !== null && row[colAQ] !== undefined && row[colAQ] !== "") {
          let feeValue = row[colAQ];
          // Try to extract number if it's a string
          if (typeof feeValue === 'string') {
            feeValue = feeValue.replace(/[^\d.]/g, '');
          }
          const fee = Number(feeValue);
          if (!isNaN(fee) && fee > 0) {
            tuitionFees.push(fee);
            feeFound = true;
          }
        }
      }
      
      // Last resort: search columns 19-39 and 51+ for reasonable fee values
      if (!feeFound && row.length > 0) {
        for (let colIndex = 19; colIndex < Math.min(row.length, 150); colIndex++) {
          // Skip columns 40-50 (already checked above)
          if (colIndex >= 40 && colIndex <= 50) continue;
          
          if (row[colIndex] !== null && row[colIndex] !== undefined && row[colIndex] !== "") {
            let feeValue = row[colIndex];
            // Try to extract number if it's a string
            if (typeof feeValue === 'string') {
              feeValue = feeValue.replace(/[^\d.]/g, '');
            }
            const fee = Number(feeValue);
            // Check if it's a reasonable annual fee (between 1,000 and 500,000 KES)
            if (!isNaN(fee) && fee >= 1000 && fee <= 500000) {
              tuitionFees.push(fee);
              feeFound = true;
              break; // Only take first valid fee found
            }
          }
        }
      }
      
      // Also try searching columns beyond 118 (DO) in case the column is further right
      if (!feeFound && row.length > 118) {
        for (let colIndex = 119; colIndex < Math.min(row.length, 150); colIndex++) {
          if (row[colIndex] !== null && row[colIndex] !== undefined && row[colIndex] !== "") {
            let feeValue = row[colIndex];
            // Try to extract number if it's a string
            if (typeof feeValue === 'string') {
              feeValue = feeValue.replace(/[^\d.]/g, '');
            }
            const fee = Number(feeValue);
            // Check if it's a reasonable annual fee (between 1,000 and 500,000 KES)
            if (!isNaN(fee) && fee >= 1000 && fee <= 500000) {
              tuitionFees.push(fee);
              feeFound = true;
              break;
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

    const boysPercent = totalStudents > 0 
      ? parseFloat(((totalBoys / totalStudents) * 100).toFixed(2)) 
      : 0;
    const girlsPercent = totalStudents > 0 
      ? parseFloat(((totalGirls / totalStudents) * 100).toFixed(2)) 
      : 0;

    // Calculate tuition fee statistics
    console.log(`\n=== FEE COLLECTION SUMMARY ===`);
    console.log(`Total fees collected (before filtering): ${tuitionFees.length}`);
    if (tuitionFees.length > 0) {
      console.log(`Raw fees (first 20):`, tuitionFees.slice(0, 20));
      console.log(`Fee range (raw): ${Math.min(...tuitionFees)} - ${Math.max(...tuitionFees)}`);
    }
    
    // Filter out any invalid fees and ensure we have valid numbers
    // Also filter to reasonable range (1,000 to 500,000) to avoid picking up wrong columns
    const validFees = tuitionFees.filter(fee => 
      fee > 0 && 
      !isNaN(fee) && 
      isFinite(fee) &&
      fee >= 1000 &&  // At least 1,000 KES
      fee <= 500000   // At most 500,000 KES
    );
    
    // If no fees in range, try a wider range (100 to 1,000,000) to see what we have
    const widerRangeFees = tuitionFees.filter(fee => 
      fee > 0 && 
      !isNaN(fee) && 
      isFinite(fee) &&
      fee >= 100 &&  // At least 100 KES
      fee <= 1000000   // At most 1,000,000 KES
    );
    
    const averageTuition = validFees.length > 0 
      ? Math.round(validFees.reduce((sum, fee) => sum + fee, 0) / validFees.length)
      : 0;
    const lowestTuition = validFees.length > 0 ? Math.min(...validFees) : 0;
    const maximumTuition = validFees.length > 0 ? Math.max(...validFees) : 0;
    
    console.log(`Valid fees (1K-500K range): ${validFees.length}`);
    if (validFees.length > 0) {
      console.log(`Fee range: ${lowestTuition} - ${maximumTuition}, Average: ${averageTuition}`);
      console.log(`Sample fees (first 10):`, validFees.slice(0, 10));
    } else if (widerRangeFees.length > 0) {
      console.log(`WARNING: Found ${widerRangeFees.length} fees in wider range (100-1M) but none in strict range (1K-500K)`);
      console.log(`Wider range fees (first 10):`, widerRangeFees.slice(0, 10));
      console.log(`Wider range: ${Math.min(...widerRangeFees)} - ${Math.max(...widerRangeFees)}`);
    } else if (tuitionFees.length > 0) {
      console.log(`WARNING: Found ${tuitionFees.length} fees but none in any reasonable range`);
      console.log(`Sample fees found:`, tuitionFees.slice(0, 10));
    }
    console.log(`=== END FEE SUMMARY ===\n`);

    // Calculate quartiles using valid fees
    let quartile1 = 0;
    let quartile2 = 0;
    let quartile3 = 0;
    let quartile4 = 0;

    if (validFees.length > 0) {
      const sortedFees = [...validFees].sort((a, b) => a - b);
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

    console.log(`Processed ${validRows} valid rows from SASL sheet "${sheetName}"`);
    console.log(`Total Schools: ${totalSchools} (counted as ${validRows} valid rows), Total Students: ${totalStudents}`);
    
    // Debug: Check sample row data for annual fees
    if (validFees.length === 0 && data.length > 1) {
      console.log(`No annual fees found. Checking sample rows...`);
      console.log(`Using column index ${colDO} for annual fees`);
      console.log(`Header row (first 150 columns):`, headerRow.slice(0, 150).map((h, i) => ({ col: i, header: h })).filter(h => h.header));
      console.log(`Total columns in header: ${headerRow.length}`);
      
      // Check first 5 rows for any numeric values that might be fees
      for (let i = 1; i < Math.min(6, data.length); i++) {
        const row = data[i];
        if (row && !row.every(cell => cell === null || cell === undefined || cell === "")) {
          console.log(`\nRow ${i} analysis:`);
          console.log(`  Column ${colDO} (DO):`, row[colDO], typeof row[colDO]);
          console.log(`  Columns 40-50:`, row.slice(40, 51).map((val, idx) => ({ col: 40 + idx, val, type: typeof val })).filter(v => v.val));
          console.log(`  Columns 100-130:`, row.slice(100, 131).map((val, idx) => ({ col: 100 + idx, val, type: typeof val })).filter(v => v.val && !isNaN(Number(v.val))));
          
          // Find all numeric values in the row that could be fees
          const numericValues = [];
          for (let j = 0; j < Math.min(row.length, 150); j++) {
            if (row[j] !== null && row[j] !== undefined && row[j] !== "") {
              let numVal = row[j];
              if (typeof numVal === 'string') {
                numVal = numVal.replace(/[^\d.]/g, '');
              }
              const num = Number(numVal);
              if (!isNaN(num) && num > 0 && num < 1000000) {
                numericValues.push({ col: j, value: num });
              }
            }
          }
          if (numericValues.length > 0) {
            console.log(`  All numeric values found (0-1M range):`, numericValues.slice(0, 20));
          }
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
      studentReach: {
        total: totalStudents,
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
    console.error("Error parsing SASL Excel file:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

