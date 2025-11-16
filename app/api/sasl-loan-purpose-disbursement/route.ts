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

    // Column indices: D = 3 (Loan Purpose), K = 10 (Loan Amount Disbursed)
    const colD = 3; // Loan Purpose
    const colK = 10; // Loan Amount Disbursed

    // Aggregate by loan purpose
    const purposeTotals: { [key: string]: number } = {};

    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Get loan purpose from COL D
      const loanPurpose = row[colD] ? String(row[colD]).trim() : "";
      
      // Get loan amount from COL K
      const loanAmount = row[colK] !== null && row[colK] !== undefined && row[colK] !== ""
        ? Number(row[colK])
        : null;

      // Only process if we have both purpose and amount
      if (loanPurpose && loanAmount !== null && !isNaN(loanAmount) && loanAmount > 0) {
        // Normalize purpose name (capitalize first letter of each word)
        const normalizedPurpose = loanPurpose
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");

        if (!purposeTotals[normalizedPurpose]) {
          purposeTotals[normalizedPurpose] = 0;
        }
        purposeTotals[normalizedPurpose] += loanAmount;
      }
    }

    // Convert to array and sort by total (descending)
    const purposeData = Object.entries(purposeTotals)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    console.log(`Processed ${purposeData.length} loan purposes from SASL sheet "${sheetName}"`);

    return NextResponse.json(purposeData);
  } catch (err) {
    console.error("Error parsing SASL Excel file for loan purpose disbursement:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

