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

    // Find purpose and amount columns from header row
    const headerRow = data[0] || [];
    let colD = 3; // Default to column D
    let colK = 10; // Default to column K
    
    // First pass: Look for amount/disbursement column (prioritize this)
    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i] || "").toLowerCase().trim();
      if (header.includes("disbamt") || header.includes("disbursed") || (header.includes("amount") && !header.includes("purpose"))) {
        colK = i;
        break; // Found amount column, stop searching
      }
    }
    
    // Second pass: Look for purpose column
    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i] || "").toLowerCase().trim();
      if (header.includes("purpose") || header.includes("loan purpose") || header.includes("use")) {
        colD = i;
        break; // Found purpose column, stop searching
      }
    }

    console.log(`SASL - Purpose column index: ${colD}, Amount column index: ${colK}`);
    console.log(`SASL - Header row sample:`, headerRow.slice(0, 15));
    console.log(`SASL - Purpose header: "${headerRow[colD]}", Amount header: "${headerRow[colK]}"`);
    
    // Verify we didn't get the same column for both
    if (colD === colK) {
      console.warn(`WARNING: Purpose and Amount columns are the same (${colD})! Checking header row...`);
      // Try to find amount column by looking for "disbamt" more carefully
      for (let i = 0; i < headerRow.length; i++) {
        const header = String(headerRow[i] || "").toLowerCase().trim();
        if (header === "disbamt" || header.includes("disb") && header.includes("amt")) {
          colK = i;
          console.log(`Fixed amount column to index ${i} (header: "${headerRow[i]}")`);
          break;
        }
      }
    }

    // Aggregate by loan purpose
    const purposeTotals: { [key: string]: { amount: number; loans: number } } = {};

    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Get loan purpose from the identified column
      const loanPurpose = row[colD] ? String(row[colD]).trim() : "";
      
      // Get loan amount from the identified column
      let loanAmountValue = row[colK];
      
      // Only process if we have both purpose and amount
      if (loanPurpose && loanAmountValue !== null && loanAmountValue !== undefined && loanAmountValue !== "") {
        // Try to extract number if it's a string with currency or formatting
        if (typeof loanAmountValue === 'string') {
          // Remove currency symbols, commas, and extract number
          loanAmountValue = loanAmountValue.replace(/[^\d.]/g, '');
        }
        const loanAmount = Number(loanAmountValue);
        
        if (!isNaN(loanAmount) && loanAmount > 0) {
          // Normalize purpose name (capitalize first letter of each word)
          const normalizedPurpose = loanPurpose
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

          if (!purposeTotals[normalizedPurpose]) {
            purposeTotals[normalizedPurpose] = { amount: 0, loans: 0 };
          }
          purposeTotals[normalizedPurpose].amount += loanAmount;
          purposeTotals[normalizedPurpose].loans += 1;
        }
      }

    }

    // Convert to array and sort by total (descending)
    const purposeData = Object.entries(purposeTotals)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        loans: data.loans,
      }))
      .sort((a, b) => b.amount - a.amount);

    console.log(`Processed ${purposeData.length} loan purposes from SASL sheet "${sheetName}"`);
    console.log(`Sample data:`, purposeData.slice(0, 5));

    if (purposeData.length === 0) {
      console.warn(`No loan purpose data found. Processed ${data.length - 1} rows.`);
      console.log(`Sample row data:`, data.slice(1, 5).map(row => ({
        purpose: row[colD],
        amount: row[colK],
        row: row.slice(0, 15)
      })));
    }

    return NextResponse.json(purposeData);
  } catch (err) {
    console.error("Error parsing SASL Excel file for loan purpose disbursement:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

