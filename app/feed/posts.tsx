"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  BellActive,
  Delete,
  DotsVertical,
  Edit,
  Hide,
  Save,
  Comment,
  Share,
  ThumbsUp,
} from "@/icons";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { postsQuery } from "@/lib/queries";
import { Avatar } from "./avatar";
import { Comments } from "./comments";

type FeedPost = NonNullable<
  Awaited<
    ReturnType<NonNullable<ReturnType<typeof postsQuery.infinite>["queryFn"]>>
  >
>;

export function Posts() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(postsQuery.infinite());
  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  const listRef = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    const container =
      list?.closest<HTMLElement>("._layout_middle_wrap") ?? null;
    setScrollEl(container);
    if (list && container) {
      setScrollMargin(
        list.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop,
      );
    }
  }, [posts.length]);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => scrollEl,
    estimateSize: () => 600,
    overscan: 5,
    scrollMargin,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastIndex = virtualItems.length
    ? virtualItems[virtualItems.length - 1].index
    : 0;

  useEffect(() => {
    if (lastIndex >= posts.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [lastIndex, posts.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
        <p>Loading posts...</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
        <p>No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={listRef}
        style={{
          position: "relative",
          height: virtualizer.getTotalSize(),
          flexShrink: 0,
        }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const post = posts[item.index];
          return (
            <div
              key={post.id}
              data-index={item.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${item.start - scrollMargin}px)`,
                paddingBottom: "16px",
              }}
            >
              <PostCard post={post} />
            </div>
          );
        })}
      </div>
      {isFetchingNextPage && (
        <p style={{ textAlign: "center", padding: "12px", flexShrink: 0 }}>
          Loading more...
        </p>
      )}
    </>
  );
}

function PostCard({ post }: { post: FeedPost["items"][number] }) {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);

  const patch = (changes: Partial<FeedPost["items"][number]>) => {
    queryClient.setQueryData(
      postsQuery.infinite().queryKey,
      (old) =>
        old && {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((p) =>
              p.id === post.id ? { ...p, ...changes } : p,
            ),
          })),
        },
    );
  };

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      const res = await api("posts/[id]/like", {
        method: "POST",
        params: { id: String(post.id) },
      });
      if (!res.ok) throw new Error("Failed to like.");
      return res.json() as Promise<{ liked: boolean; count: number }>;
    },
    onMutate: () => {
      const prev = { likedByMe: post.likedByMe, likeCount: post.likeCount };
      patch({
        likedByMe: !post.likedByMe,
        likeCount: post.likeCount + (post.likedByMe ? -1 : 1),
      });
      return prev;
    },
    onSuccess: ({ liked, count }) =>
      patch({ likedByMe: liked, likeCount: count }),
    onError: (_err, _vars, prev) => prev && patch(prev),
  });

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <Avatar
                name={`${post.author.firstName} ${post.author.lastName}`}
                size={50}
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.author.firstName} {post.author.lastName}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {timeAgo(post.createdAt)} .{" "}
                <a href="#0">
                  {post.visibility === "public" ? "Public" : "Private"}
                </a>
              </p>
            </div>
          </div>
          <PostDropdown />
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {post.imageUrl && (
          <div className="_feed_inner_timeline_image">
            <img src={post.imageUrl} alt="" className="_time_img" />
          </div>
        )}
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <Likers likers={post.topLikers} count={post.likeCount} />
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>{post.commentCount}</span> Comment
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>122</span> Share
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_reaction">
        <button
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction${
            post.likedByMe ? " _feed_reaction_active" : ""
          }`}
          onClick={() => toggleLike()}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <ThumbsUp />
              {post.likedByMe ? "Unlike" : "Like"}
            </span>
          </span>
        </button>
        <button
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          onClick={() => setShowComments((v) => !v)}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <Comment />
              Comment
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <Share />
              Share
            </span>
          </span>
        </button>
      </div>
      {showComments && (
        <div className="_feed_inner_timeline_cooment_area">
          <Comments postId={post.id} />
        </div>
      )}
    </div>
  );
}

const MAX_VISIBLE_LIKERS = 5;

function Likers({
  likers,
  count,
}: {
  likers: FeedPost["items"][number]["topLikers"];
  count: number;
}) {
  if (count === 0) return null;

  const visible = likers.slice(0, MAX_VISIBLE_LIKERS);
  const extra = count - visible.length;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((liker, i) => (
        <span
          key={liker.id}
          title={`${liker.firstName} ${liker.lastName}`}
          style={{
            display: "inline-flex",
            borderRadius: "50%",
            border: "2px solid #fff",
            marginLeft: i === 0 ? 0 : "-10px",
            zIndex: i,
          }}
        >
          <Avatar name={`${liker.firstName} ${liker.lastName}`} size={30} />
        </span>
      ))}
      {extra > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            minWidth: "34px",
            borderRadius: "50%",
            background: "#1877f2",
            color: "#fff",
            border: "2px solid #fff",
            marginLeft: visible.length ? "-10px" : 0,
            zIndex: MAX_VISIBLE_LIKERS,
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}

function PostDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="_feed_inner_timeline_post_box_dropdown">
      <div className="_feed_timeline_post_dropdown">
        <button
          className="_feed_timeline_post_dropdown_link"
          onClick={() => setOpen(!open)}
        >
          <DotsVertical />
        </button>
      </div>
      <div
        className={`_feed_timeline_dropdown _timeline_dropdown${
          open ? " show" : ""
        }`}
      >
        <ul className="_feed_timeline_dropdown_list">
          <li className="_feed_timeline_dropdown_item">
            <a href="#0" className="_feed_timeline_dropdown_link">
              <span>
                <Save />
              </span>
              Save Post
            </a>
          </li>
          <li className="_feed_timeline_dropdown_item">
            <a href="#0" className="_feed_timeline_dropdown_link">
              <span>
                <BellActive />
              </span>
              Turn On Notification
            </a>
          </li>
          <li className="_feed_timeline_dropdown_item">
            <a href="#0" className="_feed_timeline_dropdown_link">
              <span>
                <Hide />
              </span>
              Hide
            </a>
          </li>
          <li className="_feed_timeline_dropdown_item">
            <a href="#0" className="_feed_timeline_dropdown_link">
              <span>
                <Edit />
              </span>
              Edit Post
            </a>
          </li>
          <li className="_feed_timeline_dropdown_item">
            <a href="#0" className="_feed_timeline_dropdown_link">
              <span>
                <Delete />
              </span>
              Delete Post
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
