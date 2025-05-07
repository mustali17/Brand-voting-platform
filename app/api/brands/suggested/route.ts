import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Brand from "@/models/Brand";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  await connect();

  try {
    const suggestedBrands = await Brand.aggregate([
      {
        $match: {
          followers: { $ne: new mongoose.Types.ObjectId(userId) }, // Exclude followed
        },
      },
      {
        $addFields: {
          followerCount: { $size: { $ifNull: ["$followers", []] } },
        },
      },
      {
        $sort: {
          followerCount: -1,
        },
      },
      {
        $limit: 10, // Adjust limit as needed
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logoUrl: 1,
          website: 1,
          description: 1,
          isVerified: 1,
          followerCount: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, suggestedBrands });
  } catch (error) {
    console.error("[SUGGESTED_BRANDS_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
