export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/User";
import Brand from "@/models/Brand";

export const GET = async (request: NextRequest) => {
  try {
    await connect();

    const users = await User.find()
      .select("-password")
      .lean() as Array<{ _id: string | { toString: () => string }, [key: string]: any }>;

    // Get all user IDs
    const userIds = users.map(user => user._id);

    // Find all brands owned by any user
    const brands = await Brand.find({ ownerId: { $in: userIds } })
      .select("name logoUrl ownerId")
      .lean();

    // Map brands to their respective owners
    const brandsByOwner: { [key: string]: any[] } = {};
    for (const brand of brands) {
      const ownerId = brand.ownerId.toString();
      if (!brandsByOwner[ownerId]) brandsByOwner[ownerId] = [];
      brandsByOwner[ownerId].push(brand);
    }

    // Attach ownedBrands to users
    const enrichedUsers = users.map(user => ({
      ...user,
      ownedBrands: brandsByOwner[(user._id as { toString: () => string }).toString()] || [],
    }));

    return NextResponse.json(enrichedUsers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
