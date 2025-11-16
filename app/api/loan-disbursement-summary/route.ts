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
    
    // Convert to JSON with cell addresses to access specific cells
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z1000');
    
    // Helper function to get cell value by address (e.g., "I18")
    const getCellValue = (address: string): number => {
      const cell = worksheet[address];
      if (!cell || cell.v === null || cell.v === undefined) return 0;
      const value = Number(cell.v);
      return isNaN(value) ? 0 : value;
    };

    // Based on the specification:
    // 2022: Annual Value (I18), Annual Volume (G18), Average Value (I19)
    // 2023: Annual Value (I34), Annual Volume (G34), Average Value (I35)
    // 2024: Annual Value (I50), Annual Volume (G50), Average Value (I51)
    // 2025: Annual Value (I66), Annual Volume (G66), Average Value (I67)
    // Note: The pattern seems to be every 16 rows, but we'll try to find the actual cells
    
    // Try to find the data by searching for year labels or use the specified cell addresses
    const years = [
      { year: "2022", valueCell: "I18", volumeCell: "G18", avgCell: "I19" },
      { year: "2023", valueCell: "I34", volumeCell: "G34", avgCell: "I35" },
      { year: "2024", valueCell: "I50", volumeCell: "G50", avgCell: "I51" },
      { year: "2025", valueCell: "I66", volumeCell: "G66", avgCell: "I67" },
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
        if (/202[2-5]/.test(cellValue)) {
          const year = cellValue.match(/202[2-5]/)?.[0];
          if (year) {
            // Try to find value, volume, and average in nearby cells
            // COL G (index 6) = Volume, COL I (index 8) = Value
            if (!yearData[year]) {
              yearData[year] = {};
            }
            
            // Check if this row has numeric values in G and I columns
            if (row[6] !== null && row[6] !== undefined) {
              const vol = Number(row[6]);
              if (!isNaN(vol) && vol > 0) {
                yearData[year].volume = vol;
              }
            }
            
            if (row[8] !== null && row[8] !== undefined) {
              const val = Number(row[8]);
              if (!isNaN(val) && val > 0) {
                yearData[year].value = val;
              }
            }
            
            // Check next row for average (if it exists)
            if (i + 1 < data.length && data[i + 1]) {
              const nextRow = data[i + 1];
              if (nextRow[8] !== null && nextRow[8] !== undefined) {
                const avg = Number(nextRow[8]);
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

    console.log(`Processed loan disbursement summary from sheet "${sheetName}"`);
    console.log(`Years data:`, finalResult);

    return NextResponse.json(finalResult);
  } catch (err) {
    console.error("Error parsing Excel file for loan disbursement summary:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

