// /app/api/categories/[categoryId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { categoryId } = params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
  }

  await connect();

  try {
    const { name, categoryImageURL, subcategories } = await req.json();

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (categoryImageURL) updateFields.categoryImageURL = categoryImageURL;
    if (Array.isArray(subcategories)) updateFields.subcategories = subcategories;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error("[CATEGORY_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
