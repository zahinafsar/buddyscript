import {
  type AnyPgColumn,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const posts = pgTable(
  "posts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    imageKey: text("image_key"),
    visibility: text("visibility", { enum: ["public", "private"] })
      .notNull()
      .default("public"),
    likeCount: integer("like_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("posts_user_id_idx").on(t.userId)]
);

export const comments = pgTable(
  "comments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    parentId: integer("parent_id").references((): AnyPgColumn => comments.id),
    content: text("content").notNull(),
    likeCount: integer("like_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("comments_post_id_idx").on(t.postId),
    index("comments_user_id_idx").on(t.userId),
    index("comments_parent_id_idx").on(t.parentId),
  ]
);

export const commentLikes = pgTable(
  "comment_likes",
  {
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.commentId, t.userId] }),
    index("comment_likes_user_id_idx").on(t.userId),
  ]
);

export const likes = pgTable(
  "likes",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.postId, t.userId] }),
    index("likes_user_id_idx").on(t.userId),
  ]
);

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type CommentLike = typeof commentLikes.$inferSelect;
