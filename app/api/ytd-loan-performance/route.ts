import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    // Read the Excel file
    const filePath = join(process.cwd(), "Monthly Loan Reports-Premier Credit.xlsx");
    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Find the "Loan Disb. 2025" sheet
    const sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("loan disb") && name.toLowerCase().includes("2025")
    );

    if (!sheetName) {
      return NextResponse.json(
        { error: "Loan Disb. 2025 sheet not found" },
        { status: 404 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

    // Column indices (0-based): A=0, B=1, E=4, F=5, J=9, M=12
    const colA = 0; // For counting loans
    const colB = 1; // Branches
    const colE = 4; // Owner Gender
    const colF = 5; // Schools
    const colJ = 9; // Loan Size
    const colM = 12; // Monthly Total / Portfolio Value

    // Process data rows (skip header)
    let totalPortfolioValue = 0;
    const loanSizes: number[] = [];
    const schools = new Set<string>();
    const branches = new Set<string>();
    let femaleOwners = 0;
    let maleOwners = 0;
    let totalLoans = 0;

    // Also track monthly totals from specific cells (M10, M26, etc.)
    // These are typically summary rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Count loans: SUM(COUNT(COL A)) - count non-empty values in COL A
      if (row[colA] !== null && row[colA] !== undefined && row[colA] !== "") {
        totalLoans++;
      }

      // Total Loan Portfolio Value: SUM(COL M)
      if (row[colM] !== null && row[colM] !== undefined && row[colM] !== "") {
        const value = Number(row[colM]);
        if (!isNaN(value) && value > 0) {
          totalPortfolioValue += value;
        }
      }

      // Average Loan Size: AVERAGE(COL J)
      if (row[colJ] !== null && row[colJ] !== undefined && row[colJ] !== "") {
        const loanSize = Number(row[colJ]);
        if (!isNaN(loanSize) && loanSize > 0) {
          loanSizes.push(loanSize);
        }
      }

      // Schools Financed: UNIQUECOUNT(COL F)
      if (row[colF] !== null && row[colF] !== undefined && row[colF] !== "") {
        const school = String(row[colF]).trim();
        if (school) {
          schools.add(school);
        }
      }

      // Active Branches: UNIQUE COUNT (COL B)
      if (row[colB] !== null && row[colB] !== undefined && row[colB] !== "") {
        const branch = String(row[colB]).trim();
        if (branch) {
          branches.add(branch);
        }
      }

      // Owner Gender Diversity: COL E(%FEMALE/TOTAL) COL E(%MALE/TOTAL)
      if (row[colE] !== null && row[colE] !== undefined && row[colE] !== "") {
        const gender = String(row[colE]).toUpperCase().trim();
        if (gender === "FEMALE" || gender === "F") {
          femaleOwners++;
        } else if (gender === "MALE" || gender === "M") {
          maleOwners++;
        }
      }
    }

    // Calculate averages and percentages
    const averageLoanSize = loanSizes.length > 0
      ? loanSizes.reduce((sum, size) => sum + size, 0) / loanSizes.length
      : 0;

    const totalOwners = femaleOwners + maleOwners;
    const femaleOwnerPercent = totalOwners > 0 ? (femaleOwners / totalOwners) * 100 : 0;
    const maleOwnerPercent = totalOwners > 0 ? (maleOwners / totalOwners) * 100 : 0;

    console.log(`Processed YTD 2025 data from sheet "${sheetName}"`);
    console.log(`Total Portfolio: ${totalPortfolioValue}, Loans: ${totalLoans}, Schools: ${schools.size}, Branches: ${branches.size}`);

    return NextResponse.json({
      totalPortfolioValue,
      totalLoans,
      averageLoanSize,
      schoolsFinanced: schools.size,
      activeBranches: branches.size,
      ownerGenderDiversity: {
        female: femaleOwnerPercent,
        male: maleOwnerPercent,
        femaleCount: femaleOwners,
        maleCount: maleOwners,
      },
    });
  } catch (err) {
    console.error("Error parsing Excel file for YTD data:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

