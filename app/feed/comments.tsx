"use client";

import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { Send, ThumbsUp } from "@/icons";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { commentsQuery, postsQuery, repliesQuery } from "@/lib/queries";
import type { Comment } from "@/app/api/posts/[id]/comments/route";
import { Avatar } from "./avatar";

export function Comments({ postId }: { postId: number }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(commentsQuery.infinite(postId));
  const comments = (data?.pages.flatMap((p) => p.items) ?? []) as Comment[];

  return (
    <div className="_timline_comment_main">
      <CommentComposer postId={postId} />
      {isLoading && <p style={{ padding: "8px 0" }}>Loading comments...</p>}
      {comments.map((comment) => (
        <CommentItem key={comment.id} postId={postId} comment={comment} />
      ))}
      {hasNextPage && (
        <ShowMore
          loading={isFetchingNextPage}
          label="Show more comments"
          onClick={() => fetchNextPage()}
        />
      )}
    </div>
  );
}

function ShowMore({
  loading,
  label,
  onClick,
}: {
  loading: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="_previous_comment">
      <button
        type="button"
        className="_previous_comment_txt"
        disabled={loading}
        onClick={onClick}
      >
        {loading ? "Loading..." : label}
      </button>
    </div>
  );
}

function CommentItem({
  postId,
  comment,
}: {
  postId: number;
  comment: Comment;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <span className="_comment_image_link">
          <Avatar
            name={`${comment.author.firstName} ${comment.author.lastName}`}
            size={40}
          />
        </span>
      </div>
      <div className="_comment_area">
        <CommentBody comment={comment} onReply={() => setReplying((v) => !v)} />
        {replying && (
          <CommentComposer
            postId={postId}
            parentId={comment.id}
            placeholder="Write a reply"
            onDone={() => setReplying(false)}
          />
        )}
        {comment.comments?.map((reply) => (
          <ReplyRow key={reply.id} reply={reply} />
        ))}
        {comment.replyNextCursor && (
          <MoreReplies
            commentId={comment.id}
            startCursor={comment.replyNextCursor}
          />
        )}
      </div>
    </div>
  );
}

function ReplyRow({ reply }: { reply: Comment }) {
  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <span className="_comment_image_link">
          <Avatar
            name={`${reply.author.firstName} ${reply.author.lastName}`}
            size={40}
          />
        </span>
      </div>
      <div className="_comment_area">
        <CommentBody comment={reply} />
      </div>
    </div>
  );
}

function MoreReplies({
  commentId,
  startCursor,
}: {
  commentId: number;
  startCursor: string;
}) {
  const [open, setOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...repliesQuery.infinite(commentId, startCursor),
      enabled: open,
    });

  if (!open) {
    return (
      <ShowMore
        loading={false}
        label="Show more replies"
        onClick={() => setOpen(true)}
      />
    );
  }

  const replies = (data?.pages.flatMap((p) => p.items) ?? []) as Comment[];

  return (
    <>
      {replies.map((reply) => (
        <ReplyRow key={reply.id} reply={reply} />
      ))}
      {(hasNextPage || replies.length === 0) && (
        <ShowMore
          loading={isFetchingNextPage}
          label="Show more replies"
          onClick={() => fetchNextPage()}
        />
      )}
    </>
  );
}

function CommentComposer({
  postId,
  parentId,
  placeholder = "Write a comment",
  onDone,
}: {
  postId: number;
  parentId?: number;
  placeholder?: string;
  onDone?: () => void;
}) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api("posts/[id]/comments", {
        method: "POST",
        params: { id: String(postId) },
        body: { content, parentId },
      });
      if (!res.ok) throw new Error("Failed to comment.");
      return res.json();
    },
    onSuccess: () => {
      setContent("");
      onDone?.();
      queryClient.invalidateQueries({ queryKey: commentsQuery.all(postId) });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: repliesQuery.all(parentId) });
      }
      queryClient.setQueryData<
        InfiniteData<{ items: { id: number; commentCount: number }[] }>
      >(postsQuery.infinite().queryKey, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.map((p) =>
                  p.id === postId
                    ? { ...p, commentCount: p.commentCount + 1 }
                    : p
                ),
              })),
            }
          : old
      );
    },
  });

  function submit() {
    if (content.trim() && !isPending) mutate();
  }

  return (
    <div className="_feed_inner_comment_box">
      <form
        className="_feed_inner_comment_box_form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <img
              src="/assets/images/comment_img.png"
              alt=""
              className="_comment_img"
            />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              className="form-control _comment_textarea"
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            ></textarea>
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon">
          <button
            type="submit"
            className="_feed_inner_comment_box_icon_btn"
            disabled={isPending || !content.trim()}
            aria-label="Send"
            style={{
              background: "#1877f2",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: isPending || !content.trim() ? 0.5 : 1,
            }}
          >
            <span style={{ display: "inline-flex", marginRight: "-5px" }}>
              <Send />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

function CommentBody({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply?: () => void;
}) {
  const [liked, setLiked] = useState(comment.likedByMe);
  const [count, setCount] = useState(comment.likeCount);

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      const res = await api("comments/[id]/like", {
        method: "POST",
        params: { id: String(comment.id) },
      });
      if (!res.ok) throw new Error("Failed to like.");
      return res.json() as Promise<{ liked: boolean; count: number }>;
    },
    onMutate: () => {
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    },
    onSuccess: (data) => {
      setLiked(data.liked);
      setCount(data.count);
    },
    onError: () => {
      setLiked(liked);
      setCount(count);
    },
  });

  return (
    <div className="_comment_details">
      <div className="_comment_details_top">
        <div className="_comment_name">
          <h4 className="_comment_name_title">
            {comment.author.firstName} {comment.author.lastName}
          </h4>
        </div>
      </div>
      <div className="_comment_status">
        <p className="_comment_status_text">
          <span>{comment.content}</span>
        </p>
      </div>
      {count > 0 && (
        <div className="_total_reactions">
          <div className="_total_react">
            <span className="_reaction_like">
              <ThumbsUp />
            </span>
          </div>
          <span className="_total">{count}</span>
        </div>
      )}
      <div className="_comment_reply">
        <div className="_comment_reply_num">
          <ul
            className="_comment_reply_list"
            style={{ display: "flex", gap: "14px" }}
          >
            <li>
              <span
                style={{ cursor: "pointer", fontWeight: liked ? 700 : 400 }}
                onClick={() => toggleLike()}
              >
                {liked ? "Liked." : "Like."}
              </span>
            </li>
            {onReply && (
              <li>
                <span style={{ cursor: "pointer" }} onClick={onReply}>
                  Reply.
                </span>
              </li>
            )}
            <li>
              <span className="_time_link">{timeAgo(comment.createdAt)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
