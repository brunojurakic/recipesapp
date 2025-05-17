import { NextRequest, NextResponse } from "next/server";
import { parseJSON, saveImage } from "@/lib/utils/functions";



export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get('image') as File | null;

  
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