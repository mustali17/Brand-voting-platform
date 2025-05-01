import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utils/db";
import Brand from "@/models/Brand";
import { authOptions } from "@/utils/authOptions";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();
    const brands = await Brand.find().populate("ownerId", "name email").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, brands });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}