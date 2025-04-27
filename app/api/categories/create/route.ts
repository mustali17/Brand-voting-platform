import { getServerSession } from "next-auth";
import Category from "@/models/Category";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { CreateCategorySchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateCategorySchema.safeParse(body);

  if (!parsed.success) {
    const errors = parsed.error.errors.map(err => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return NextResponse.json(
      { error: "Invalid input", details: errors },
      { status: 400 }
    );
  }

  await connect();
  const { name, categoryImageURL } = parsed.data;

  // Check if category already exists (case-insensitive)
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingCategory) {
    return NextResponse.json(
      { error: "Category already exists" },
      { status: 400 }
    );
  }

  const category = await Category.create({
    name,
    categoryImageURL,
    subcategories: [],
  });

  return NextResponse.json({ success: true, category });
}
