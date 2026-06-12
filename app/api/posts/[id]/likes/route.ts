import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { likes, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPost } from "@/lib/posts";

export async function GET(
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

  const likers = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(likes)
    .innerJoin(users, eq(likes.userId, users.id))
    .where(eq(likes.postId, postId))
    .orderBy(desc(likes.createdAt));

  return NextResponse.json(likers);
}
