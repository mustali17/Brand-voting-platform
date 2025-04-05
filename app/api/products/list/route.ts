import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

/**
 * Example Usage:
 * - /api/products/list
 * - /api/products/list?page=2&limit=5
 * - /api/products/list?search=phone
 * - /api/products/list?brandId=abc123
 * - /api/products/list?category=Tech&subcategory=Phones
 * 
 * If the user is logged in, results will prioritize followed brands and interests.
 */

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
  
    const skip = (page - 1) * limit;
  
    try {
      await connect();
  
      const filter: any = {
        name: { $regex: search, $options: "i" }
      };
      if (brandId) filter.brand = brandId;
      if (category) filter.category = category;
      if (subcategory) filter.subcategory = subcategory;
  
      if (session) {
        const user = await User.findById(session.user.id);
        if (user) {
          filter.$or = [
            { brand: { $in: user.following } },
            { category: { $in: user.interests || [] } }
          ];
        }
      }
  
      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      const total = await Product.countDocuments(filter);
  
      return NextResponse.json({
        success: true,
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }