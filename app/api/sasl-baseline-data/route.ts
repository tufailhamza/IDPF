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

    // Column indices (0-based): D=3, E=4, O=14, P=15, Q=16, DO=123
    const colD = 3; // Total Number of Schools
    const colE = 4; // School Proprietor Gender
    const colO = 14; // Boys
    const colP = 15; // Girls
    const colQ = 16; // Total Students
    const colDO = excelColumnToIndex("DO"); // Annual Fees (DO = 123 in 0-based)

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
      
      // Total Number of Schools: SUM(COL D)
      if (row[colD] !== null && row[colD] !== undefined && row[colD] !== "") {
        const schoolCount = Number(row[colD]);
        if (!isNaN(schoolCount) && schoolCount > 0) {
          totalSchools += schoolCount;
        }
      }

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
      if (row[colDO] !== null && row[colDO] !== undefined && row[colDO] !== "") {
        const fee = Number(row[colDO]);
        if (!isNaN(fee) && fee > 0) {
          tuitionFees.push(fee);
        }
      }
    }

    // Calculate percentages
    const totalProprietors = femaleProprietors + maleProprietors;
    const femaleProprietorPercent = totalProprietors > 0 ? (femaleProprietors / totalProprietors) * 100 : 0;
    const maleProprietorPercent = totalProprietors > 0 ? (maleProprietors / totalProprietors) * 100 : 0;

    const boysPercent = totalStudents > 0 ? (totalBoys / totalStudents) * 100 : 0;
    const girlsPercent = totalStudents > 0 ? (totalGirls / totalStudents) * 100 : 0;

    // Calculate tuition fee statistics
    const averageTuition = tuitionFees.length > 0 
      ? tuitionFees.reduce((sum, fee) => sum + fee, 0) / tuitionFees.length 
      : 0;
    const lowestTuition = tuitionFees.length > 0 ? Math.min(...tuitionFees) : 0;
    const maximumTuition = tuitionFees.length > 0 ? Math.max(...tuitionFees) : 0;

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

    console.log(`Processed ${validRows} valid rows from SASL sheet "${sheetName}"`);
    console.log(`Total Schools: ${totalSchools}, Total Students: ${totalStudents}`);

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

