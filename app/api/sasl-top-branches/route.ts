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

    // Find the "All Loans upto Sept 2025" sheet
    const sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("all loans") && (name.toLowerCase().includes("sept") || name.toLowerCase().includes("2025"))
    );

    if (!sheetName) {
      return NextResponse.json(
        { error: "All Loans upto Sept 2025 sheet not found" },
        { status: 404 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

    // Column indices: C = 2 (Branch), J = 9 (Loan Amount Disbursed)
    const colC = 2; // Branch
    const colJ = 9; // Loan Amount Disbursed

    // Aggregate by branch
    const branchTotals: { [key: string]: number } = {};

    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Get branch name from COL C
      const branch = row[colC] ? String(row[colC]).trim() : "";
      
      // Get loan amount from COL J
      const loanAmount = row[colJ] !== null && row[colJ] !== undefined && row[colJ] !== ""
        ? Number(row[colJ])
        : null;

      // Only process if both branch and amount are valid
      if (branch && loanAmount !== null && !isNaN(loanAmount) && loanAmount > 0) {
        if (!branchTotals[branch]) {
          branchTotals[branch] = 0;
        }
        branchTotals[branch] += loanAmount;
      }
    }

    // Convert to array and sort by total (descending)
    const branchData = Object.entries(branchTotals)
      .map(([branch, total]) => ({
        branch,
        commitment: total,
      }))
      .sort((a, b) => b.commitment - a.commitment)
      .slice(0, 10); // Top 10

    console.log(`Processed ${branchData.length} top branches from SASL sheet "${sheetName}"`);

    return NextResponse.json(branchData);
  } catch (err) {
    console.error("Error parsing SASL Excel file for top branches:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

