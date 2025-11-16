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

    // Find purpose column from header row
    const headerRow = data[0] || [];
    let purposeColIndex = -1;
    const colK = 10; // COL K = Loan Amount Disbursed (index 10)

    // Look for purpose-related column headers
    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i] || "").toLowerCase().trim();
      if (header.includes("purpose") || header.includes("loan purpose") || header.includes("use")) {
        purposeColIndex = i;
        break;
      }
    }

    // If not found, try common columns (J = 9, I = 8, H = 7)
    if (purposeColIndex === -1) {
      // Check if column J (index 9) contains text values
      purposeColIndex = 9; // Default to column J
    }

    // Aggregate by loan purpose
    const purposeTotals: { [key: string]: number } = {};

    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Get loan purpose from the identified column
      const loanPurpose = row[purposeColIndex] ? String(row[purposeColIndex]).trim() : "";
      
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

    console.log(`Processed ${purposeData.length} loan purposes from sheet "${sheetName}"`);

    return NextResponse.json(purposeData);
  } catch (err) {
    console.error("Error parsing Excel file for loan purpose disbursement:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

