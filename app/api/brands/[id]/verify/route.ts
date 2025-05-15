import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Brand from "@/models/Brand";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: brandId } = params;

  if (!mongoose.Types.ObjectId.isValid(brandId)) {
    return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });
  }

  const { isVerified } = await req.json();

  if (typeof isVerified !== "boolean") {
    return NextResponse.json(
      { error: "isVerified must be a boolean" },
      { status: 400 }
    );
  }

  await connect();

  try {
    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { isVerified },
      { new: true }
    );

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Brand ${isVerified ? "approved" : "rejected"} successfully.`,
      brand,
    });
  } catch (error) {
    console.error("[BRAND_VERIFICATION_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
