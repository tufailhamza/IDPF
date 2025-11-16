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
    
    // Helper function to get cell value by address (e.g., "H21")
    const getCellValue = (address: string): number => {
      const cell = worksheet[address];
      if (!cell || cell.v === null || cell.v === undefined) return 0;
      const value = Number(cell.v);
      return isNaN(value) ? 0 : value;
    };

    // Based on the specification:
    // 2019: Annual Value (H21), Annual Volume (G21), Average Value (H22)
    // 2020: Annual Value (H36), Annual Volume (G36), Average Value (H37)
    // Pattern: Each year is about 15 rows apart, average is on next row
    // Let's define the years and their cell addresses
    const years = [
      { year: "2019", valueCell: "H21", volumeCell: "G21", avgCell: "H22" },
      { year: "2020", valueCell: "H36", volumeCell: "G36", avgCell: "H37" },
      { year: "2021", valueCell: "H51", volumeCell: "G51", avgCell: "H52" },
      { year: "2022", valueCell: "H66", volumeCell: "G66", avgCell: "H67" },
      { year: "2023", valueCell: "H81", volumeCell: "G81", avgCell: "H82" },
      { year: "2024", valueCell: "H96", volumeCell: "G96", avgCell: "H97" },
      { year: "2025", valueCell: "H111", volumeCell: "G111", avgCell: "H112" },
    ];

    const result = years.map(({ year, valueCell, volumeCell, avgCell }) => {
      const annualValue = getCellValue(valueCell);
      const annualVolume = getCellValue(volumeCell);
      const averageValue = getCellValue(avgCell);

      return {
        year,
        annualValue,
        annualVolume,
        averageValue,
      };
    });

    // If the specific cells don't have data, try to find data by searching for year labels
    // This is a fallback approach
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];
    
    // Search for year patterns in the data
    const yearData: { [key: string]: { value?: number; volume?: number; avg?: number } } = {};
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;

      // Look for year in first few columns
      for (let j = 0; j < Math.min(5, row.length); j++) {
        const cellValue = String(row[j] || "").trim();
        if (/201[9]|202[0-5]/.test(cellValue)) {
          const year = cellValue.match(/201[9]|202[0-5]/)?.[0];
          if (year) {
            // Try to find value, volume, and average in nearby cells
            // COL G (index 6) = Volume, COL H (index 7) = Value
            if (!yearData[year]) {
              yearData[year] = {};
            }
            
            // Check if this row has numeric values in G and H columns
            if (row[6] !== null && row[6] !== undefined) {
              const vol = Number(row[6]);
              if (!isNaN(vol) && vol > 0) {
                yearData[year].volume = vol;
              }
            }
            
            if (row[7] !== null && row[7] !== undefined) {
              const val = Number(row[7]);
              if (!isNaN(val) && val > 0) {
                yearData[year].value = val;
              }
            }
            
            // Check next row for average (if it exists)
            if (i + 1 < data.length && data[i + 1]) {
              const nextRow = data[i + 1];
              if (nextRow[7] !== null && nextRow[7] !== undefined) {
                const avg = Number(nextRow[7]);
                if (!isNaN(avg) && avg > 0) {
                  yearData[year].avg = avg;
                }
              }
            }
          }
        }
      }
    }

    // Merge the results - prefer specific cell values, fall back to found data
    const finalResult = result.map((item) => {
      const found = yearData[item.year];
      return {
        year: item.year,
        annualValue: item.annualValue || found?.value || 0,
        annualVolume: item.annualVolume || found?.volume || 0,
        averageValue: item.averageValue || found?.avg || 0,
      };
    });

    console.log(`Processed SASL loan disbursement summary from sheet "${sheetName}"`);
    console.log(`Years data:`, finalResult);

    return NextResponse.json(finalResult);
  } catch (err) {
    console.error("Error parsing SASL Excel file for loan disbursement summary:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

