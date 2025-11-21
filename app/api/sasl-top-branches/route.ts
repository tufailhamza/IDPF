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

    // Column indices: D = 3 (Branch), J = 9 (Loan Amount Disbursed)
    const colD = 3; // Branch (COL D)
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

      // Get branch name from COL D
      const branch = row[colD] ? String(row[colD]).trim() : "";
      
      // Get loan amount from COL J (Loan Amount Disbursed)
      let loanAmountValue = row[colJ];
      
      // Parse string values if needed
      if (loanAmountValue !== null && loanAmountValue !== undefined && loanAmountValue !== "") {
        if (typeof loanAmountValue === 'string') {
          // Remove currency symbols, commas, and extract number
          loanAmountValue = loanAmountValue.replace(/[^\d.]/g, '');
        }
        loanAmountValue = Number(loanAmountValue);
      } else {
        loanAmountValue = null;
      }
      
      const loanAmount = loanAmountValue;

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
    console.log(`Sample data:`, branchData.slice(0, 3));

    return NextResponse.json(branchData);
  } catch (err) {
    console.error("Error parsing SASL Excel file for top branches:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

