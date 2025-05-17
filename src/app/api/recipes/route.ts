import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get('image');
  // You can access other fields similarly
  // Example: const title = formData.get('title');

  // For demonstration, log the image info
  if (image && typeof image === 'object' && 'name' in image) {
    console.log('Image name:', image.name);
  } else {
    console.log('No image uploaded');
  }

  // Convert formData to a plain object (excluding files for now)
  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (key !== 'image') data[key] = value;
  });

  return NextResponse.json({ ...data, image: image ? 'uploaded' : null });
}