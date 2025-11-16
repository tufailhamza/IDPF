import { NextRequest, NextResponse } from "next/server";

// In-memory storage (in production, use a database)
interface Todo {
  id: number;
  filename: string;
  content: Buffer;
}

const todos: Todo[] = [];
let nextId = 1;

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

    // Parse file content — example: if CSV
    // const text = buffer.toString("utf-8");
    // const lines = text.split("\n");
    // For demo, we just store raw buffer

    todos.push({
      id: nextId++,
      filename,
      content: buffer, // store for further processing
    });

    console.log(`Received file: ${filename}, total todos: ${todos.length}`);

    return NextResponse.json({ success: true, id: nextId - 1 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

