// app/api/category/[id]/visibility/route.ts

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic"; // Avoid caching

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const categoryId = params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    await connect();

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    category.hidden = !category.hidden; // Toggle visibility
    await category.save();

    return NextResponse.json({
      success: true,
      message: `Category is now ${category.hidden ? "hidden" : "visible"}`,
      categoryId: category._id,
      hidden: category.hidden,
    });
  } catch (error) {
    console.error("[TOGGLE_CATEGORY_VISIBILITY_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
