import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

// Recursive tree builder
async function buildTree(userId) {
  const user = await User.findById(userId)
    .select("_id phone name successors")
    .lean();

  if (!user) return null;

  const childrenTrees = [];

  // Loop through successors & recursively build their trees
  for (const childId of user.successors) {
    const childTree = await buildTree(childId);
    if (childTree) childrenTrees.push(childTree);
  }

  return {
    id: user._id.toString(),
    phone: user.phone,
    name: user.name || "",
    children: childrenTrees,
  };
}

export async function GET(_, { params }) {
  await dbConnect();

  const tree = await buildTree(params.id);

  return NextResponse.json({
    success: true,
    tree,
  });
}
