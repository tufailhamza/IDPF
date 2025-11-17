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

    // Find branch and amount columns from header row
    const headerRow = data[0] || [];
    let colB = 1; // Default to column B
    let colD = 3; // Default to column D
    
    // Look for branch-related column headers
    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i] || "").toLowerCase().trim();
      if (header.includes("branch") || header.includes("location")) {
        colB = i;
      }
      if (header.includes("amount") || header.includes("disbursed") || header.includes("loan amount")) {
        colD = i;
      }
    }

    console.log(`Branch column index: ${colB}, Amount column index: ${colD}`);
    console.log(`Header row sample:`, headerRow.slice(0, 10));

    // Aggregate by branch
    const branchTotals: { [key: string]: number } = {};

    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Get branch name
      const branch = row[colB] ? String(row[colB]).trim() : "";
      
      // Get loan amount
      const loanAmount = row[colD] !== null && row[colD] !== undefined && row[colD] !== ""
        ? Number(row[colD])
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

    console.log(`Processed ${branchData.length} top branches from sheet "${sheetName}"`);
    console.log(`Sample data:`, branchData.slice(0, 5));

    if (branchData.length === 0) {
      console.warn(`No branch data found. Processed ${data.length - 1} rows.`);
      console.log(`Sample row data:`, data.slice(1, 5).map(row => ({
        branch: row[colB],
        amount: row[colD],
        row: row.slice(0, 10)
      })));
    }

    return NextResponse.json(branchData);
  } catch (err) {
    console.error("Error parsing Excel file for top branches:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

