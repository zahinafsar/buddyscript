import { NextApiRequest } from "next-ts-api";
import { NextResponse } from "next/server";
import { desc, eq, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { likes, posts, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { publicImageUrl } from "@/lib/storage";

type Liker = { id: number; firstName: string; lastName: string };

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: posts.id,
      content: posts.content,
      imageKey: posts.imageKey,
      visibility: posts.visibility,
      likeCount: posts.likeCount,
      createdAt: posts.createdAt,
      authorId: users.id,
      authorFirstName: users.firstName,
      authorLastName: users.lastName,
      topLikers: sql<Liker[]>`coalesce((
        select json_agg(json_build_object('id', t.id, 'firstName', t.first_name, 'lastName', t.last_name))
        from (
          select u.id, u.first_name, u.last_name
          from ${likes} l
          join ${users} u on u.id = l.user_id
          where l.post_id = ${posts.id} and l.user_id <> ${user.id}
          limit 5
        ) t
      ), '[]'::json)`,
      likedByMe: sql<boolean>`exists(
        select 1 from ${likes} l
        where l.post_id = ${posts.id} and l.user_id = ${user.id}
      )`,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(or(eq(posts.visibility, "public"), eq(posts.userId, user.id)))
    .orderBy(desc(posts.createdAt));

  const feed = rows.map((row) => ({
    id: row.id,
    content: row.content,
    imageUrl: row.imageKey ? publicImageUrl(row.imageKey) : null,
    visibility: row.visibility,
    createdAt: row.createdAt.toISOString(),
    likeCount: row.likeCount,
    likedByMe: row.likedByMe,
    topLikers: row.topLikers,
    author: {
      id: row.authorId,
      firstName: row.authorFirstName,
      lastName: row.authorLastName,
    },
  }));

  return NextResponse.json(feed);
}

const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content is required.")
    .max(5000, "Post content is too long."),
  visibility: z.enum(["public", "private"]),
  imageKey: z
    .string()
    .optional(),
});

export type CreatePostBody = z.infer<typeof createPostSchema>;

export async function POST(request: NextApiRequest<CreatePostBody>) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createPostSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }
  const { content, visibility, imageKey } = parsed.data;

  const [post] = await db
    .insert(posts)
    .values({ userId: user.id, content, visibility, imageKey: imageKey ?? null })
    .returning();

  return NextResponse.json({ id: post.id }, { status: 201 });
}
