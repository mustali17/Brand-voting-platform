import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Product from "@/models/Product";
import Vote from "@/models/Vote";
import connect from "@/utils/db";
import { authOptions } from "@/utils/authOptions";
/**
 * POST /api/products/unvote
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

    const vote = await Vote.findOneAndDelete({
      userId: session.user.id,
      productId
    });

    if (!vote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    await Product.findByIdAndUpdate(productId, { $inc: { votes: -1 } });

    return NextResponse.json({ success: true, message: "Vote removed" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
