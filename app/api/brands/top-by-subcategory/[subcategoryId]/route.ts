import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { subcategoryId: string } }
) {
  const { subcategoryId } = params;

  if (!subcategoryId || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
    return NextResponse.json({ error: "Invalid subcategoryId" }, { status: 400 });
  }

  await connect();

  try {
    let brands = await Product.aggregate([
      {
        $match: { subcategory: subcategoryId },
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
          description: "$brand.description",
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
          description: 1,
          totalVotes: 1,
          productCount: 1,
          followerCount: 1,
        },
      },
    ]);

    // Fallback if no brands found
    if (brands.length === 0) {
      const productBrands = await Product.find({ subcategory: subcategoryId }).distinct("brandId");

      const fallbackBrands = await Brand.find({ _id: { $in: productBrands } })
        .limit(5)
        .select("name logoUrl followers description")
        .lean();

      brands = await Promise.all(
        fallbackBrands.map(async (brand) => ({
          _id: brand._id,
          name: brand.name,
          logoUrl: brand.logoUrl,
          description: brand.description,
          totalVotes: 0,
          productCount: await Product.countDocuments({ brandId: brand._id, subcategory: subcategoryId }),
          followerCount: brand.followers?.length || 0,
        }))
      );
    }

    return NextResponse.json({ success: true, brands });
  } catch (error) {
    console.error("[TOP_BRANDS_BY_SUBCATEGORY_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
