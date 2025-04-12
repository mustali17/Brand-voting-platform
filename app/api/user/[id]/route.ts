import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";

// Get user by ID
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await connect();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Update user by ID
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  
  try {
    await connect();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    // Only include fields that are provided in the request
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.role) updateData.role = body.role;
    if (body.emailVerified !== undefined) updateData.emailVerified = body.emailVerified;
    if (body.following) updateData.following = body.following;
    
    // If password is provided, hash it
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 5);
    }

    // Check if the user exists first
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If email is being updated, check if it already exists
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: body.email });
      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Delete user by ID
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await connect();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};