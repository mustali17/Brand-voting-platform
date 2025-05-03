import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import mongoose from "mongoose";
import Category from "@/models/Category";

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const { categoryId } = params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
  }

  await connect();

  const categoryExists = await Category.exists({ _id: categoryId });
  if (!categoryExists) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  try {
    let brands = await Product.aggregate([
      {
        $match: { categoryId: new mongoose.Types.ObjectId(categoryId) },
      },
      {
        $group: {
          _id: "$brandId",
          totalVotes: { $sum: "$votes" },
          productCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$brand" },
      {
        $addFields: {
          followerCount: { $size: { $ifNull: ["$brand.followers", []] } },
          name: "$brand.name",
          logoUrl: "$brand.logoUrl",
        },
      },
      {
        $sort: {
          totalVotes: -1,
          followerCount: -1,
          productCount: -1,
        },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          name: 1,
          logoUrl: 1,
          totalVotes: 1,
          productCount: 1,
          followerCount: 1,
        },
      },
    ]);

    // If no brands found, fallback to brands with products in this category
    if (brands.length === 0) {
      const productBrands = await Product.find({ categoryId }).distinct("brandId");

      const fallbackBrands = await Brand.find({ _id: { $in: productBrands } })
        .limit(5)
        .select("name logoUrl")
        .lean();

      brands = fallbackBrands.map(async (brand) => ({
        _id: brand._id,
        name: brand.name,
        logoUrl: brand.logoUrl,
        totalVotes: 0,
        productCount: await Product.countDocuments({ brandId: brand._id, categoryId }),
        followerCount: brand.followers?.length || 0,
      }));
    }

    return NextResponse.json({ success: true, brands });
  } catch (error) {
    console.error("[TOP_BRANDS_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
