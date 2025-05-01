import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Otp from "@/models/Otp";

export async function POST(req: NextRequest) {
  await connect();
  const { email, code } = await req.json();

  const record = await Otp.findOne({ email });

  if (!record) return NextResponse.json({ error: "No OTP found" }, { status: 404 });

   // Check if already verified
   if (record.verified) {
    return NextResponse.json({ 
      success: true, 
      message: "Email already verified" 
    });
  }

  const now = new Date().getTime();
  const expiry = new Date(record.createdAt).getTime() + 10 * 60 * 1000;

  if (now > expiry) {
    await Otp.deleteOne({ email });
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  if (record.code !== code) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

   // OTP is valid - mark as verified
   record.verified = true;
   await record.save();

  return NextResponse.json({ success: true, message: "OTP verified" });
}