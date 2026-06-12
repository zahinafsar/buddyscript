import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, type Post } from "@/db/schema";

export type PostAccess =
  | { ok: true; post: Post }
  | { ok: false; status: 404 | 403 };

export async function canAccessPost(
  postId: number,
  userId: number
): Promise<PostAccess> {
  const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) });
  if (!post) return { ok: false, status: 404 };
  if (post.visibility === "private" && post.userId !== userId) {
    return { ok: false, status: 403 };
  }
  return { ok: true, post };
}
