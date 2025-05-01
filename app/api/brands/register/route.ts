import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import { RegisterBrandSchema } from "@/lib/schemas";
import Brand from "@/models/Brand";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("🚀 ~ POST ~ session:", session)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = RegisterBrandSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message
      }));
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }

    await connect();
    const { name, logoUrl, website, description } = parsed.data;

    const brand = await Brand.create({
      name,
      logoUrl,
      website,
      description,
      ownerId: session.user.id
    });

    return NextResponse.json({ success: true, brand });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}