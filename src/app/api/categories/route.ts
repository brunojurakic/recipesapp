import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { category } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.query.category.findMany({
      orderBy: asc(category.name)
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}