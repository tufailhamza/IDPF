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

    // Find the "All Loans" sheet - try multiple patterns
    let sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("all loans") && (name.toLowerCase().includes("sept") || name.toLowerCase().includes("2025"))
    );

    // Fallback: try just "all loans"
    if (!sheetName) {
      sheetName = workbook.SheetNames.find(
        (name) => name.toLowerCase().includes("all loans")
      );
    }

    // Fallback: try any sheet with "loans" in the name
    if (!sheetName) {
      sheetName = workbook.SheetNames.find(
        (name) => name.toLowerCase().includes("loans")
      );
    }

    if (!sheetName) {
      console.log("Available sheets:", workbook.SheetNames);
      return NextResponse.json(
        { error: "All Loans sheet not found", availableSheets: workbook.SheetNames },
        { status: 404 }
      );
    }

    console.log(`Using sheet: "${sheetName}"`);

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

    // Find purpose column from header row
    const headerRow = data[0] || [];
    let purposeColIndex = -1;
    let amountColIndex = -1;

    // Look for purpose-related column headers
    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i] || "").toLowerCase().trim();
      if (header.includes("purpose") || header.includes("loan purpose") || header.includes("use")) {
        purposeColIndex = i;
      }
      if (header.includes("amount") || header.includes("disbursed") || header.includes("loan amount")) {
        amountColIndex = i;
      }
    }

    // If not found, try common columns
    if (purposeColIndex === -1) {
      purposeColIndex = 9; // Default to column J (index 9)
    }
    if (amountColIndex === -1) {
      amountColIndex = 10; // Default to column K (index 10)
    }

    console.log(`Purpose column index: ${purposeColIndex}, Amount column index: ${amountColIndex}`);
    console.log(`Header row sample:`, headerRow.slice(0, 15));

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
      
      // Get loan amount from the identified column
      let loanAmountValue = row[amountColIndex];
      // Try to extract number if it's a string with currency or formatting
      if (loanAmountValue !== null && loanAmountValue !== undefined && loanAmountValue !== "") {
        if (typeof loanAmountValue === 'string') {
          // Remove currency symbols, commas, and extract number
          loanAmountValue = loanAmountValue.replace(/[^\d.]/g, '');
        }
        const loanAmount = Number(loanAmountValue);
        
        // Only process if we have both purpose and amount
        if (loanPurpose && !isNaN(loanAmount) && loanAmount > 0) {
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
    }

    // Convert to array and sort by total (descending)
    const purposeData = Object.entries(purposeTotals)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    console.log(`Processed ${purposeData.length} loan purposes from sheet "${sheetName}"`);
    console.log(`Sample data:`, purposeData.slice(0, 5));

    if (purposeData.length === 0) {
      console.warn(`No loan purpose data found. Processed ${data.length - 1} rows.`);
      console.log(`Sample row data:`, data.slice(1, 5).map(row => ({
        purpose: row[purposeColIndex],
        amount: row[amountColIndex],
        row: row.slice(0, 15)
      })));
    }

    return NextResponse.json(purposeData);
  } catch (err) {
    console.error("Error parsing Excel file for loan purpose disbursement:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

