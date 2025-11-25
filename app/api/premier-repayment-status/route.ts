import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { join } from "path";

// Helper function to convert Excel column letter to index (e.g., "C" -> 2)
function excelColumnToIndex(column: string): number {
  let index = 0;
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + (column.charCodeAt(i) - 64);
  }
  return index - 1; // Convert to 0-based index
}

export async function GET(req: NextRequest) {
  try {
    // Read the Premier Credit Excel file
    const filePath = join(process.cwd(), "Monthly Loan Reports-Premier Credit.xlsx");
    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Find the "Sept, 2025" sheet
    const sheetName = workbook.SheetNames.find(
      (name) => name.toLowerCase().includes("sept") && name.includes("2025")
    );

    if (!sheetName) {
      return NextResponse.json(
        { error: "Sept, 2025 sheet not found" },
        { status: 404 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as (any | null)[][];

    // Get column indices
    const colC = excelColumnToIndex("C"); // Column C (index 2)
    const row36 = 35; // Row 36 (0-based index) - Repayment
    const row37 = 36; // Row 37 (0-based index) - Arrears

    // Extract values from C36 and C37
    const repayment = data[row36]?.[colC];
    const arrears = data[row37]?.[colC];

    // Convert to numbers, handling string values with commas or currency symbols
    const parseValue = (value: any): number => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        // Remove currency symbols, commas, and whitespace
        const cleaned = value.replace(/[KES,\s]/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

    const repaymentValue = parseValue(repayment);
    const arrearsValue = parseValue(arrears);
    const total = repaymentValue + arrearsValue;

    // Calculate percentages
    const repaymentPercent = total > 0 ? (repaymentValue / total) * 100 : 0;
    const arrearsPercent = total > 0 ? (arrearsValue / total) * 100 : 0;

    return NextResponse.json({
      repayment: repaymentValue,
      arrears: arrearsValue,
      total: total,
      repaymentPercent: repaymentPercent,
      arrearsPercent: arrearsPercent,
    });
  } catch (error: any) {
    console.error("Error reading repayment status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to read repayment status data" },
      { status: 500 }
    );
  }
}

