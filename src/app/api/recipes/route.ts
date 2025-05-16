import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log(body.image);
  return NextResponse.json(body)
  
}