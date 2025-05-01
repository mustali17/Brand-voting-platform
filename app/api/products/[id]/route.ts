import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Vote from "@/models/Vote";
import { authOptions } from "@/utils/authOptions";
import connect from "@/utils/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    await connect();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Fetch the product
    const product = await Product.findById(id).lean() as { categoryId?: string; brandId?: string } | null;

    if (!product || !product.categoryId || !product.brandId) {
      return NextResponse.json({ error: "Product data is incomplete or invalid" }, { status: 400 });
    }  

    // Fetch related category and brand names
    const category = await Category.findById(product.categoryId);

    // Fetch the brand details
    const brand = await Brand.findById(product.brandId);

    // Check if the user has voted
    let hasVoted = false;
    if (userId) {
      const vote = await Vote.findOne({ userId, productId: id });
      hasVoted = !!vote;
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        category,
        brand: brand ? brand.name : null,
        hasVoted,
      },
    });
  } catch (error: any) {
    console.error("[PRODUCT_FETCH_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};


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

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check brand ownership
    const brand = await Brand.findById(existingProduct.brandId);
    if (!brand || brand.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this product" },
        { status: 403 }
      );
    }

    let categoryIdToUse = existingProduct.categoryId;

    // If category name is being updated
    if (updates.category) {
      const foundCategory = await Category.findOne({ name: updates.category });
      if (!foundCategory) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      categoryIdToUse = foundCategory._id;

      // If subcategories are also provided, validate them
      if (updates.subcategory) {
        const isValidSub = updates.subcategory.every((sub: string) =>
          foundCategory.subcategories.includes(sub)
        );

        if (!isValidSub) {
          return NextResponse.json(
            { error: "One or more subcategories are invalid" },
            { status: 400 }
          );
        }
      }
    }

    // Only update allowed fields
    const allowedFields = ["name", "imageUrl", "description", "subcategory"];
    const updatePayload: Record<string, any> = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updatePayload[field] = updates[field];
      }
    });

    // Always set updated categoryId if provided
    updatePayload.categoryId = categoryIdToUse;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("[PRODUCT_UPDATE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
