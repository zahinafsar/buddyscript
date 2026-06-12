import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { likes, posts } from "@/db/schema";

export async function togglePostLike(postId: number, userId: number) {
  return db.transaction(async (tx) => {
    const inserted = await tx
      .insert(likes)
      .values({ postId, userId })
      .onConflictDoNothing()
      .returning({ userId: likes.userId });
    const liked = inserted.length > 0;

    if (!liked) {
      await tx
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    }

    const [updated] = await tx
      .update(posts)
      .set({ likeCount: sql`${posts.likeCount} + ${liked ? 1 : -1}` })
      .where(eq(posts.id, postId))
      .returning({ likeCount: posts.likeCount });

    return { liked, count: updated.likeCount };
  });
}
