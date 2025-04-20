import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/utils/db";
import Brand from "@/models/Brand";
import Product from "@/models/Product";

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

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const products = await Product.find({ brandId: id }).sort({ createdAt: -1 });

    return NextResponse.json({
      brand,
      products
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error", message: err.message }, { status: 500 });
  }
};
