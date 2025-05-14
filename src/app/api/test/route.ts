import { db } from "@/db/drizzle";
import { recipe, instruction } from "@/db/schema";
import { NextRequest } from "next/server";

export async function GET() {
  const data = await db.query.recipe.findMany({
    with: {
      instructions: true
    }
  });
  return Response.json(data);
}

export async function POST(request : NextRequest) {
  console.log(request);
  
  await db.insert(recipe).values({
    userId: 'YQA9veXlfWBS8WvDxI0AjBaLKVH2AFal',
    title: 'Test Recipe',
    description: 'Test Description',
    servings: 4,
    preparationTime: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return Response.json(request);
}