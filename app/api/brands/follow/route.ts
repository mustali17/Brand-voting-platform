import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utils/db";
import User from "@/models/User";
import Brand from "@/models/Brand";
import { FollowBrandSchema } from "@/lib/schemas";
import { authOptions } from "@/utils/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = FollowBrandSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message
      }));
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }

    const { brandId } = parsed.data;
    await connect();

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.following.includes(brandId)) {
      return NextResponse.json({ error: "Already following this brand" }, { status: 400 });
    }

    user.following.push(brandId);
    await user.save();

    brand.followers.push(user._id);
    await brand.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const parsed = FollowBrandSchema.safeParse(body);
  
    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message
      }));
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }
  
      const { brandId } = parsed.data;
      await connect();
  
      const user = await User.findById(session.user.id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      if (!user.following.includes(brandId)) {
        return NextResponse.json({ error: "Not following this brand" }, { status: 400 });
      }
  
      user.following = user.following.filter((id: string) => id.toString() !== brandId);
      await user.save();

      // Remove user from brand followers
      const brand = await Brand.findById(brandId);
      if (brand) {
        brand.followers = brand.followers.filter((id: string) => id.toString() !== user._id.toString());
        await brand.save();
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      await connect();
      const user = await User.findById(session.user.id).populate("following");
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, followedBrands: user.following });
    } catch (error) {
      console.log("🚀 ~ GET ~ error:", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
