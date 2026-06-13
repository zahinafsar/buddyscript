import { NextApiRequest } from "next-ts-api";
import { NextResponse } from "next/server";
import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";
import { db } from "@/db";
import { comments, commentLikes, posts, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPost } from "@/lib/posts";

const PAGE = 5;

export type Comment = {
  id: number;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  author: { firstName: string; lastName: string };
  comments?: Comment[];
  replyNextCursor?: string | null;
};

export type CommentPage = { items: Comment[]; nextCursor: string | null };

export async function GET(
  request: NextApiRequest<null, { cursor?: string }>,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = Number((await params).id);
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

  const cursor = Number(request.nextUrl.searchParams.get("cursor"));
  const c = alias(comments, "c");
  const rows = await db
    .select({
      id: c.id,
      content: c.content,
      likeCount: c.likeCount,
      likedByMe: sql<boolean>`exists(
        select 1 from ${commentLikes} cl
        where cl.comment_id = ${c.id} and cl.user_id = ${user.id}
      )`,
      createdAt: c.createdAt,
      author: { firstName: users.firstName, lastName: users.lastName },
      comments: sql<Comment[]>`coalesce((
        select json_agg(json_build_object(
          'id', s.id, 'content', s.content, 'likeCount', s.like_count,
          'likedByMe', exists(select 1 from ${commentLikes} cl2 where cl2.comment_id = s.id and cl2.user_id = ${user.id}),
          'createdAt', s.created_at,
          'author', json_build_object('firstName', su.first_name, 'lastName', su.last_name)
        ) order by s.id desc)
        from (
          select * from ${comments} where parent_id = ${c.id} order by id desc limit ${PAGE + 1}
        ) s
        join ${users} su on su.id = s.user_id
      ), '[]'::json)`,
    })
    .from(c)
    .innerJoin(users, eq(c.userId, users.id))
    .where(
      and(
        eq(c.postId, postId),
        isNull(c.parentId),
        cursor > 0 ? lt(c.id, cursor) : undefined
      )
    )
    .orderBy(desc(c.id))
    .limit(PAGE + 1);

  const hasMore = rows.length > PAGE;
  const page = rows.slice(0, PAGE);
  const nextCursor = hasMore ? String(page[page.length - 1].id) : null;

  const items: Comment[] = page.map((row) => {
    const allReplies = row.comments ?? [];
    const replies = allReplies.slice(0, PAGE);
    return {
      id: row.id,
      content: row.content,
      likeCount: row.likeCount,
      likedByMe: row.likedByMe,
      createdAt: row.createdAt.toISOString(),
      author: row.author,
      comments: replies,
      replyNextCursor:
        allReplies.length > PAGE ? String(replies[replies.length - 1].id) : null,
    };
  });

  return NextResponse.json({ items, nextCursor });
}

const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(2000, "Comment is too long."),
  parentId: z.number().int().optional(),
});

export type CreateCommentBody = z.infer<typeof createCommentSchema>;

export async function POST(
  request: NextApiRequest<CreateCommentBody>,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = Number((await params).id);
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

  const parsed = createCommentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }
  const { content, parentId } = parsed.data;

  const comment = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(comments)
      .values({ postId, userId: user.id, content, parentId: parentId ?? null })
      .returning({ id: comments.id });
    await tx
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, postId));
    return created;
  });

  return NextResponse.json({ id: comment.id }, { status: 201 });
}
