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

    // Column indices: G = 6 (Loan Cycle)
    const colG = 6; // Loan Cycle

    // Count loans by cycle (1-13)
    const cycleCounts: { [key: number]: number } = {};

    // Initialize all cycles from 1 to 13
    for (let i = 1; i <= 13; i++) {
      cycleCounts[i] = 0;
    }

    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
        continue;
      }

      // Get loan cycle from COL G
      const cycleValue = row[colG];
      
      if (cycleValue !== null && cycleValue !== undefined && cycleValue !== "") {
        const cycle = Number(cycleValue);
        
        // Only count valid cycles (1-13)
        if (!isNaN(cycle) && cycle >= 1 && cycle <= 13) {
          cycleCounts[cycle] = (cycleCounts[cycle] || 0) + 1;
        }
      }
    }

    // Convert to array format
    const cycleData = Object.entries(cycleCounts)
      .map(([cycle, count]) => ({
        cycle: cycle,
        loans: count,
      }))
      .sort((a, b) => Number(a.cycle) - Number(b.cycle));

    console.log(`Processed SASL loan cycles from sheet "${sheetName}"`);

    return NextResponse.json(cycleData);
  } catch (err) {
    console.error("Error parsing SASL Excel file for loan cycles:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

