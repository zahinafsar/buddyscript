import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPost } from "@/lib/posts";
import { commentPostId, toggleCommentLike } from "@/lib/comments";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const commentId = Number((await params).id);
  if (!Number.isInteger(commentId)) {
    return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  }

  const comment = await commentPostId(commentId);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const access = await canAccessPost(comment.postId, user.id);
  if (!access.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await toggleCommentLike(commentId, user.id);
  return NextResponse.json(result);
}
