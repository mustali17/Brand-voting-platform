import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse,NextRequest } from "next/server";
import { RegisterUserSchema } from "@/lib/schemas";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsed = RegisterUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connect();
  const { name, email, password } = parsed.data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("User already exists", { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return NextResponse.json({ success: true, userId: newUser._id });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};