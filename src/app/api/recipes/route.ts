import { NextRequest, NextResponse } from "next/server";
import { parseJSON, saveImage } from "@/lib/utils/functions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  

  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  const formData = await request.formData();
  const image = formData.get('image') as File;

  
  let imagePath: string | null = null;
  try {
    imagePath = await saveImage(image);
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    servings: Number(formData.get('servings')),
    preparationTime: Number(formData.get('preparationTime')),
    instructions: parseJSON(formData.get('instructions')),
    categories: parseJSON(formData.get('categories')),
    ingredients: parseJSON(formData.get('ingredients')),
    allergies: parseJSON(formData.get('allergies')),
    imagePath,
  };

  return NextResponse.json(data);
}