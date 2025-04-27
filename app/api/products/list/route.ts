/**
 * @route GET /api/products/list
 *
 * Example Usages:
 *
 * - Get all products (paginated):
 *   /api/products/list
 *
 * - Search across product name, category, subcategory, or brand name:
 *   /api/products/list?search=phone
 *   /api/products/list?search=Electronics
 *   /api/products/list?search=Samsung
 *   /api/products/list?search=Smartphones
 *
 * - Paginate search results:
 *   /api/products/list?search=phone&page=2&limit=5
 *
 * Notes:
 * - The `search` param intelligently matches:
 *   - Product `name`
 *   - Subcategory
 *   - Category name → maps to `categoryId`
 *   - Brand name → maps to `brandId`
 */

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import User from "@/models/User";
import Category from "@/models/Category";
import Vote from "@/models/Vote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    await connect();

    let products: any[] = [];
    let total = 0;

    const filter: any = {};

    const user = await User.findById(userId).select("following").lean() as { following?: string[] } | null;
    const followingBrandIds = user?.following?.map((id: string) => id.toString()) || [];

    if (search) {
      const regex = new RegExp(search, "i");

      const [brandMatch, categoryMatch] = await Promise.all([
        Brand.findOne({ name: regex }),
        Category.findOne({ name: regex }),
      ]);

      if (brandMatch) {
        filter.brandId = brandMatch._id;
      } else if (categoryMatch) {
        filter.categoryId = categoryMatch._id;
      } else {
        // Default: match by product name or subcategory
        filter.$or = [
          { name: regex },
          { subcategory: regex }
        ];
      }
       products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("brandId", "name logoUrl")
        .populate("categoryId", "name")
        .lean() as Array<{ _id: string; [key: string]: any }>;
  
       total = await Product.countDocuments(filter);
    }else {
      const priorityProducts = await Product.find({ brandId: { $in: followingBrandIds } })
        .sort({ createdAt: -1 })
        .populate("brandId", "name logoUrl")
        .populate("categoryId", "name")
        .lean();

      const otherProducts = await Product.find({ brandId: { $nin: followingBrandIds } })
        .sort({ createdAt: -1 })
        .populate("brandId", "name logoUrl")
        .populate("categoryId", "name")
        .lean();

      const combinedProducts = [...priorityProducts, ...otherProducts];

      total = combinedProducts.length;
      products = combinedProducts.slice(skip, skip + limit);
    }


    // Determine hasVoted for each product
    const productIds = products.map((p) => p._id);
    const votes = await Vote.find({ userId, productId: { $in: productIds } }).select("productId").lean();
    const votedProductIds = new Set(votes.map(v => v.productId.toString()));

    const productsWithVotesAndFollowing = products.map((product) => ({
      ...product,
      hasVoted: votedProductIds.has(product._id.toString()),
      isFollowing: followingBrandIds.includes(product.brandId?._id?.toString() || ""),
    }));

    return NextResponse.json({
      success: true,
      products:productsWithVotesAndFollowing,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[PRODUCT_LIST_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
