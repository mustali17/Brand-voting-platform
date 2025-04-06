import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utils/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import { AddProductSchema } from "@/lib/schemas";
import { authOptions } from "@/utils/authOptions";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const parsed = AddProductSchema.safeParse(body);
  
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }
  
      const { brandId, name, imageUrl, description, category, subcategory } = parsed.data;
      await connect();
  
      const existingCategory = await Category.findOne({ name: category });
      if (!existingCategory) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }

      const isValidSub = existingCategory.subcategories.includes(subcategory);
      if (!isValidSub) {
        return NextResponse.json({ error: "Invalid subcategory" }, { status: 400 });
      }

      const brand = await Brand.findById(brandId);
      if (!brand) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 });
      }
  
      if (brand.ownerId.toString() !== session.user.id) {
        return NextResponse.json({ error: "Forbidden: You do not own this brand" }, { status: 403 });
      }
  
      const product = await Product.create({
        brandId,
        name,
        imageUrl,
        description,
        category,
        subcategory,
        createdBy: session.user.id,
        createdAt: new Date()
      });
  
      return NextResponse.json({ success: true, product });
    } catch (error) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }