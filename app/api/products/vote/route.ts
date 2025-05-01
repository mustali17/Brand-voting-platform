import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Product from "@/models/Product";
import Vote from "@/models/Vote";
import connect from "@/utils/db";
import { authOptions } from "@/utils/authOptions";
/**
 * POST /api/products/vote
 * Body: { productId: string }
 * Auth required
 */

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    await connect();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existingVote = await Vote.findOne({
      userId: session.user.id,
      productId: productId
    });

    if (existingVote) {
      return NextResponse.json({ error: "Already voted" }, { status: 400 });
    }

    await Vote.create({
      userId: session.user.id,
      productId,
      createdAt: new Date()
    });

    product.votes += 1;
    await product.save();

    return NextResponse.json({ success: true, votes: product.votes });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
