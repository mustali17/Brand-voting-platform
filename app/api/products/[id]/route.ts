import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/utils/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {

    const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    await connect();
    const updates = await req.json();

    // Fetch existing product for fallback category if needed
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check brand ownership
    const brand = await Brand.findById(existingProduct.brandId);
    if (!brand || brand.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this product" }, { status: 403 });
    }

    // Determine the category to use for validation
    const categoryToCheck = updates.category || existingProduct.category;

    const existingCategory = await Category.findOne({ name: categoryToCheck });
    if (!existingCategory) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Validate subcategory if provided
    if (updates.subcategory) {
      const isValidSub = updates.subcategory.every((sub: string) =>
        existingCategory.subcategories.includes(sub)
      );

      if (!isValidSub) {
        return NextResponse.json(
          { error: "One or more subcategories are invalid" },
          { status: 400 }
        );
      }
    }

    // Only update allowed fields
    const allowedFields = ["name", "imageUrl", "description", "category", "subcategory"];
    const updatePayload: Record<string, any> = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updatePayload[field] = updates[field];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
