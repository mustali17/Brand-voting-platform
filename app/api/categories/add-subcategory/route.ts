import { getServerSession } from "next-auth";
import Category from "@/models/Category";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, subcategory } = await req.json();
  const { name, imageUrl } = subcategory || {};

  if (!category || !name || !imageUrl) {
    return NextResponse.json(
      { error: "Category, subcategory name, and imageUrl are required" },
      { status: 400 }
    );
  }

  await connect();

  const subcategoryObject = {
    _id: new mongoose.Types.ObjectId(),
    name,
    imageUrl,
  };

  const updated = await Category.findOneAndUpdate(
    { name: category },
    { $addToSet: { subcategories: subcategoryObject } },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, category: updated });
}
