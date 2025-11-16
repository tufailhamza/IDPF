import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// In-memory storage (in production, use a database)
interface Todo {
  id: number;
  filename: string;
  content: Buffer;
}

const todos: Todo[] = [];
let nextId = 1;

// Known Excel files that should be replaced
const KNOWN_EXCEL_FILES = [
  "Monthly Loan Reports-Premier Credit.xlsx",
  "Monthly Loans Reports_SASL.xlsx",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, file_data } = body;

    if (!filename || !file_data) {
      return NextResponse.json(
        { error: "Missing filename or file_data" },
        { status: 400 }
      );
    }

    // Decode Base64
    const buffer = Buffer.from(file_data, "base64");

    // Check if the filename matches one of our known Excel files
    const normalizedFilename = filename.trim().toLowerCase();
    const matchingFile = KNOWN_EXCEL_FILES.find((knownFile) => {
      const normalizedKnown = knownFile.toLowerCase();
      // Exact match
      if (normalizedFilename === normalizedKnown) return true;
      // Check if filename contains key parts (e.g., "premier credit" or "sasl")
      if (normalizedKnown.includes("premier credit") && normalizedFilename.includes("premier")) return true;
      if (normalizedKnown.includes("sasl") && normalizedFilename.includes("sasl")) return true;
      // Check if both contain "monthly loan" and similar structure
      if (normalizedFilename.includes("monthly") && normalizedFilename.includes("loan") && 
          normalizedKnown.includes("monthly") && normalizedKnown.includes("loan")) {
        // Check for Premier Credit match
        if (normalizedFilename.includes("premier") && normalizedKnown.includes("premier")) return true;
        // Check for SASL match
        if (normalizedFilename.includes("sasl") && normalizedKnown.includes("sasl")) return true;
      }
      return false;
    });

    if (matchingFile) {
      // Replace the existing file
      const filePath = join(process.cwd(), matchingFile);
      await writeFile(filePath, buffer);
      
      console.log(`Replaced existing file: ${matchingFile} with uploaded file: ${filename}`);
      
      return NextResponse.json({ 
        success: true, 
        message: `File ${matchingFile} has been replaced`,
        replaced: true,
        filename: matchingFile
      });
    }

    // If not a known file, store in todos array (existing behavior)
    todos.push({
      id: nextId++,
      filename,
      content: buffer, // store for further processing
    });

    console.log(`Received file: ${filename}, total todos: ${todos.length}`);

    return NextResponse.json({ success: true, id: nextId - 1, replaced: false });
  } catch (err) {
    console.error("Error in ingest endpoint:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

