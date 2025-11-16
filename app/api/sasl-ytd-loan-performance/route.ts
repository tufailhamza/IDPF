import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    // Read the SASL Excel file
    const filePath = join(process.cwd(), "Monthly Loans Reports_SASL.xlsx");
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

    // Column indices (0-based): A=0, B=1, E=4, G=6, M=12, N=13
    const colA = 0; // For counting loans
    const colB = 1; // Branches
    const colG = 6; // Schools
    const colM = 12; // Loan Amount / Portfolio Value
    const colN = 13; // Enrollment

    // Process data rows (skip header)
    let totalPortfolioValue = 0;
    const loanAmounts: number[] = [];
    const schools = new Set<string>();
    const branches = new Set<string>();
    let totalLoans = 0;
    let totalEnrollment = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Skip rows that look like monthly subtotals (usually contain "Total" or "Subtotal" in first column)
      const firstCell = String(row[0] || "").toLowerCase().trim();
      if (firstCell.includes("total") || firstCell.includes("subtotal") || firstCell.includes("monthly")) {
        continue;
      }

      // Count loans: SUM(COUNT(COL A)) - count non-empty values in COL A
      if (row[colA] !== null && row[colA] !== undefined && row[colA] !== "") {
        totalLoans++;
      }

      // Total Loan Portfolio Value: SUM(COL M) - exclude monthly subtotals
      if (row[colM] !== null && row[colM] !== undefined && row[colM] !== "") {
        const value = Number(row[colM]);
        if (!isNaN(value) && value > 0) {
          totalPortfolioValue += value;
          loanAmounts.push(value); // Also store for average calculation
        }
      }

      // Schools Financed: UNIQUECOUNT(COL G)
      if (row[colG] !== null && row[colG] !== undefined && row[colG] !== "") {
        const school = String(row[colG]).trim();
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

      // Total Enrollment: SUM(COL N) - Note: The spec says UNIQUE COUNT(SUM(COL N)) which seems odd,
      // but I'll interpret it as SUM(COL N) for total enrollment
      if (row[colN] !== null && row[colN] !== undefined && row[colN] !== "") {
        const enrollment = Number(row[colN]);
        if (!isNaN(enrollment) && enrollment > 0) {
          totalEnrollment += enrollment;
        }
      }
    }

    // Calculate average loan size: AVERAGE(COL M) - exclude monthly subtotals
    const averageLoanSize = loanAmounts.length > 0
      ? loanAmounts.reduce((sum, size) => sum + size, 0) / loanAmounts.length
      : 0;

    console.log(`Processed SASL YTD 2025 data from sheet "${sheetName}"`);
    console.log(`Total Portfolio: ${totalPortfolioValue}, Loans: ${totalLoans}, Schools: ${schools.size}, Branches: ${branches.size}, Enrollment: ${totalEnrollment}`);

    return NextResponse.json({
      totalPortfolioValue,
      totalLoans,
      averageLoanSize,
      schoolsFinanced: schools.size,
      activeBranches: branches.size,
      totalEnrollment,
    });
  } catch (err) {
    console.error("Error parsing SASL Excel file for YTD data:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

