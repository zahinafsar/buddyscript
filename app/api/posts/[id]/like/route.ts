
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPost } from "@/lib/posts";
import { togglePostLike } from "@/lib/likes";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
  }

  const access = await canAccessPost(postId, user.id);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 404 ? "Post not found." : "Forbidden" },
      { status: access.status }
    );
  }

  const result = await togglePostLike(postId, user.id);
  return NextResponse.json(result);
}
