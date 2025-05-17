// /app/api/admin/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/User";
import Brand from "@/models/Brand";
import Vote from "@/models/Vote";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();

  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  try {
    // Users
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    // Votes
    const totalVotes = await Vote.countDocuments();
    const lastMonthVotes = await Vote.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    // Brands
    const totalBrands = await Brand.countDocuments();
    const lastMonthBrands = await Brand.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    // Active brands (all time)
    const activeBrands = await Product.distinct("brandId").then(
      (arr) => arr.length
    );

    // Active brands last month
    const lastMonthActiveBrands = await Product.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $group: { _id: "$brandId" } },
    ]).then((res) => res.length);

    // Engagement
    const uniqueVoterIds = await Vote.distinct("userId");
    const uniqueVotersCount = uniqueVoterIds.length;

    const engagementRate = (uniqueVotersCount / totalUsers) * 100;

    const lastMonthVoterIds = await Vote.distinct("userId", {
      createdAt: { $gte: lastMonth },
    });
    const lastMonthVotersCount = lastMonthVoterIds.length;

    const lastMonthEngagementRate =
    totalUsers > 0 ? (lastMonthVotersCount / totalUsers) * 100 : 0;


    // % Change helper
    const percentChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        usersChange: percentChange(lastMonthUsers, totalUsers - lastMonthUsers),
        totalVotes,
        votesChange: percentChange(lastMonthVotes, totalVotes - lastMonthVotes),
        totalBrands,
        totalBrandChange: percentChange(
          lastMonthBrands,
          totalBrands - lastMonthBrands
        ),
        newBrands: lastMonthBrands,
        activeBrands,
        activeBrandsChange: percentChange(
          lastMonthActiveBrands,
          activeBrands - lastMonthActiveBrands
        ),
        engagementRate: engagementRate.toFixed(1),
        engagementChange: percentChange(
          lastMonthEngagementRate,
          engagementRate - lastMonthEngagementRate
        ).toFixed(1),
      },
    });
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
