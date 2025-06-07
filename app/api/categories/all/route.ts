export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function GET() {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin"

    const filter = isAdmin ? {} : { hidden: { $ne: true } };

    const categories = await Category.find(filter);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
