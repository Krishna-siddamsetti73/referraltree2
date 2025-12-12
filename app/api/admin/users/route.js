import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  await dbConnect();

  const roots = await User.find({ predecessor: null })
    .select("_id phone name email")
    .lean();

  return NextResponse.json({
    success: true,
    roots,
  });
}
