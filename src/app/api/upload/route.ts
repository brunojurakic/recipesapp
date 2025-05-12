import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession(req);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload a JPG, PNG, WebP, or GIF image." 
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File is too large. Maximum size is 10MB." 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, uniqueFilename);

    // Ensure uploads directory exists
    await writeFile(join(process.cwd(), 'public', 'uploads', '.gitkeep'), '');

    // Write the file
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      path: `/uploads/${uniqueFilename}` 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Error uploading file", { status: 500 });
  }
}
