import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import connect from "@/utils/db";
import { resend } from "@/utils/resend";
import Otp from "@/models/Otp";
import { sendVerificationEmail } from "@/utils/emailService";

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;

export async function POST(req: NextRequest) {
  await connect();
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const existing = await Otp.findOne({ email });

  if (existing && existing.attempts >= MAX_ATTEMPTS) {
    const timeSince = Date.now() - new Date(existing.createdAt).getTime();
    if (timeSince < OTP_EXPIRY_MINUTES * 60 * 1000) {
      return NextResponse.json({ error: "Too many attempts, try again later." }, { status: 429 });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.findOneAndUpdate(
    { email },
    { code: otp, createdAt: new Date(), $inc: { attempts: 1 } },
    { upsert: true, new: true }
  );

  try {
    // await resend.emails.send({
    //   from: "Brand Platform <onboarding@resend.dev>",
    //   to: email,
    //   subject: "Your OTP Code",
    //   html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Expires in 10 minutes.</p>`
    // });

    const emailResult = await sendVerificationEmail(email, otp);
    
    if (!emailResult.success) {
      console.error("Failed to send verification email", emailResult.error);
      return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}