import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connect();

    const categories = await Category.find({}, { _id: 0, name: 1, categoryImageURL: 1, subcategories: 1 });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
