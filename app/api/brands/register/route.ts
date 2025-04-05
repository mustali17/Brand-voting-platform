import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import { RegisterBrandSchema } from "@/lib/schemas";
import Brand from "@/models/Brand";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterBrandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await connect();
    const { name, logoUrl, website, description, ownerId } = parsed.data;

    const brand = await Brand.create({
      name,
      logoUrl,
      website,
      description,
      ownerId,
    });

    return NextResponse.json({ success: true, brand });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}