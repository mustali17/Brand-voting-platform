import { getServerSession } from "next-auth";
import Category from "@/models/Category";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name,categoryImageURL } = await req.json();

  await connect();
  const category = await Category.create({ name, categoryImageURL, subcategories: [] });

  return NextResponse.json({ success: true, category });
}
