import User from "@/models/User";
import OTP from "@/models/Otp";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { RegisterUserSchema, UpdateUserSchema } from "@/lib/schemas";
import mongoose from "mongoose";

// Create a new user
export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsed = RegisterUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connect();
  const { name, email, password, provider = "credentials" } = parsed.data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("User already exists", { status: 409 });
  }

  // Check if OTP is verified
  // Enforce OTP verification only if provider is 'credentials'
  if (provider === "credentials") {
    const otpEntry = await OTP.findOne({ email, verified: true });
    if (!otpEntry) {
      return new NextResponse("Email not verified via OTP", { status: 403 });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    provider,
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

// Get all users
export const GET = async (request: NextRequest) => {
  try {
    await connect();
    
    const users = await User.find().select("-password");
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
