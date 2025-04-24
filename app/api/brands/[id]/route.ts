import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/utils/db";
import Brand from "@/models/Brand";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";


export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await connect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    interface BrandWithFollowers {
      followers?: mongoose.Types.ObjectId[];
      [key: string]: any;
    }

    const brand = await Brand.findById(id).lean() as BrandWithFollowers;

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const products = await Product.find({ brandId: id }).sort({ createdAt: -1 }).lean();

    const isFollowing = userId ? brand.followers?.some((f: any) => f.toString() === userId) : false;

    return NextResponse.json({
      brand,
      products,
      isFollowing,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error", message: err.message }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });
  }

  try {
    await connect();
    const updates = await req.json();

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (brand.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this brand" }, { status: 403 });
    }

    const allowedFields = ["name", "logoUrl", "website", "description", "isVerified"];
    const updatePayload: Record<string, any> = {};

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updatePayload[field] = updates[field];
      }
    });

    const updatedBrand = await Brand.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updatedBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, brand: updatedBrand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
