import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";
export async function GET(req: Request, { params }: { params: { brandId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brandId } = params;
  try {
    await connect();

    const products = await Product.find({
        brandId: new mongoose.Types.ObjectId(brandId),
    }).lean();

    const productsWithVotes = products.map(product => ({
      ...product,
      votesCount: product.votes
    }));

    return NextResponse.json({ success: true, products: productsWithVotes });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
