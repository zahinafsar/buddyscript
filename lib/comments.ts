import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { commentLikes, comments } from "@/db/schema";

export async function toggleCommentLike(commentId: number, userId: number) {
  return db.transaction(async (tx) => {
    const inserted = await tx
      .insert(commentLikes)
      .values({ commentId, userId })
      .onConflictDoNothing()
      .returning({ userId: commentLikes.userId });
    const liked = inserted.length > 0;

    if (!liked) {
      await tx
        .delete(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.userId, userId)
          )
        );
    }

    const [updated] = await tx
      .update(comments)
      .set({ likeCount: sql`${comments.likeCount} + ${liked ? 1 : -1}` })
      .where(eq(comments.id, commentId))
      .returning({ likeCount: comments.likeCount });

    return { liked, count: updated.likeCount };
  });
}

export async function commentPostId(commentId: number) {
  return db.query.comments.findFirst({
    where: eq(comments.id, commentId),
    columns: { id: true, postId: true },
  });
}
