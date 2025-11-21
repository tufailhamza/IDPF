import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    // Read the Premier Credit Excel file
    const filePath = join(process.cwd(), "Monthly Loan Reports-Premier Credit.xlsx");
    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Find the "Summary - All Loans" sheet
    const sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("summary") && name.toLowerCase().includes("all loans")
    );

    if (!sheetName) {
      console.log("Available sheets:", workbook.SheetNames);
      return NextResponse.json(
        { error: "Summary - All Loans sheet not found", availableSheets: workbook.SheetNames },
        { status: 404 }
      );
    }

    console.log(`Using sheet: "${sheetName}" from Monthly Loan Reports-Premier Credit.xlsx`);

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

    // Column indices: G = 6 (Monthly Volume/Loan Count), H = 7 (Monthly Value/Loan Value Committed)
    const colG = 6; // Monthly Volume / Loan Count
    const colH = 7; // Monthly Value / Loan Value Committed

    const monthlyData: Array<{ month: string; monthlyValue: number; monthlyVolume: number }> = [];

    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Skip rows that look like annual totals (usually contain "Total" or "Annual" in first column)
      const firstCell = String(row[0] || "").toLowerCase().trim();
      if (firstCell.includes("total") || firstCell.includes("annual") || firstCell.includes("sum")) {
        continue;
      }

      // Get month label from first column (usually contains date or month name)
      const monthLabel = row[0] ? String(row[0]).trim() : "";
      
      // Skip if no month label
      if (!monthLabel) {
        continue;
      }

      // Get Monthly Value (COL H - Loan Value Committed) and Monthly Volume (COL G - Loan Count)
      let monthlyValue = row[colH];
      let monthlyVolume = row[colG];
      
      // Parse string values if needed
      if (monthlyValue !== null && monthlyValue !== undefined && monthlyValue !== "") {
        if (typeof monthlyValue === 'string') {
          monthlyValue = monthlyValue.replace(/[^\d.]/g, '');
        }
        monthlyValue = Number(monthlyValue);
      } else {
        monthlyValue = null;
      }
      
      if (monthlyVolume !== null && monthlyVolume !== undefined && monthlyVolume !== "") {
        if (typeof monthlyVolume === 'string') {
          monthlyVolume = monthlyVolume.replace(/[^\d.]/g, '');
        }
        monthlyVolume = Number(monthlyVolume);
      } else {
        monthlyVolume = null;
      }

      // Only add if both values are valid numbers
      if (monthlyValue !== null && !isNaN(monthlyValue) && monthlyVolume !== null && !isNaN(monthlyVolume)) {
        monthlyData.push({
          month: monthLabel,
          monthlyValue,
          monthlyVolume,
        });
      }
    }

    console.log(`Processed ${monthlyData.length} monthly records from sheet "${sheetName}"`);
    console.log(`Sample data:`, monthlyData.slice(0, 5));

    return NextResponse.json(monthlyData);
  } catch (err) {
    console.error("Error parsing Excel file for monthly disbursement trends:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

