import { NextApiRequest } from "next-ts-api";
import { NextResponse } from "next/server";
import { and, desc, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { commentLikes, comments, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPost } from "@/lib/posts";
import type { Comment } from "@/app/api/posts/[id]/comments/route";

const PAGE = 5;

export type RepliesPage = { items: Comment[]; nextCursor: string | null };

export async function GET(
  request: NextApiRequest<null, { cursor?: string }>,
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

  const parent = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
    columns: { postId: true },
  });
  if (!parent) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const access = await canAccessPost(parent.postId, user.id);
  if (!access.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cursor = Number(request.nextUrl.searchParams.get("cursor"));
  const rows = await db
    .select({
      id: comments.id,
      content: comments.content,
      likeCount: comments.likeCount,
      likedByMe: sql<boolean>`exists(
        select 1 from ${commentLikes} cl
        where cl.comment_id = ${comments.id} and cl.user_id = ${user.id}
      )`,
      createdAt: comments.createdAt,
      author: { firstName: users.firstName, lastName: users.lastName },
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(
      and(
        eq(comments.parentId, commentId),
        cursor > 0 ? lt(comments.id, cursor) : undefined
      )
    )
    .orderBy(desc(comments.id))
    .limit(PAGE + 1);

  const hasMore = rows.length > PAGE;
  const page = rows.slice(0, PAGE);
  const nextCursor = hasMore ? String(page[page.length - 1].id) : null;

  const items: Comment[] = page.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }));

  return NextResponse.json({ items, nextCursor });
}
