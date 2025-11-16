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

    // Find the "Summary - All Loans" sheet
    const sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("summary") && name.toLowerCase().includes("all loans")
    );

    if (!sheetName) {
      return NextResponse.json(
        { error: "Summary - All Loans sheet not found" },
        { status: 404 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

    // Column indices: H = 7 (Monthly Value), I = 8 (Monthly Volume)
    const colH = 7; // Monthly Value
    const colI = 8; // Monthly Volume

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

      // Get Monthly Value (COL H) and Monthly Volume (COL I)
      const monthlyValue = row[colH] !== null && row[colH] !== undefined && row[colH] !== ""
        ? Number(row[colH])
        : null;
      
      const monthlyVolume = row[colI] !== null && row[colI] !== undefined && row[colI] !== ""
        ? Number(row[colI])
        : null;

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

    return NextResponse.json(monthlyData);
  } catch (err) {
    console.error("Error parsing Excel file for monthly disbursement trends:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

