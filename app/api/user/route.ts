export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/User";
import Brand from "@/models/Brand";
import { RegisterUserSchema } from '@/lib/schemas';
import OTP from '@/models/Otp';

// Create a new user
export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsed = RegisterUserSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message
      }));
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }

  await connect();
  const { name, email, password, provider = 'credentials' } = parsed.data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse('User already exists', { status: 409 });
  }

  // Check if OTP is verified or provider is 'google'
  let emailVerified = false;

  if (provider === 'google') {
    emailVerified = true;
  } else if (provider === 'credentials') {
    const otpEntry = await OTP.findOne({ email, verified: true });
    if (!otpEntry) {
      return new NextResponse('Email not verified via OTP', { status: 403 });
    }
    emailVerified = true;
  }

  const newUser = new User({
    name,
    email,
    password,
    provider,
    emailVerified,
  });

  try {
    await newUser.save();
    await OTP.deleteOne({ email });
    return NextResponse.json({ success: true, userId: newUser._id });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};

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
