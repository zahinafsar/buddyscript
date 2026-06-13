"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BellActive,
  Delete,
  DotsVertical,
  Edit,
  Hide,
  Save,
  Camera,
  Comment,
  Microphone,
  Share,
  ThumbsUp,
} from "@/icons";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { postsQuery } from "@/lib/queries";
import { Avatar } from "./avatar";

type FeedPost = NonNullable<
  Awaited<
    ReturnType<NonNullable<ReturnType<typeof postsQuery.list>["queryFn"]>>
  >
>[number];

export function Posts() {
  const { data, isLoading } = useQuery(postsQuery.list());
  const posts = data ?? [];

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
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  const queryClient = useQueryClient();

  const patch = (changes: Partial<FeedPost>) => {
    queryClient.setQueryData<FeedPost[]>(postsQuery.list().queryKey, (old) =>
      old?.map((p) => (p.id === post.id ? { ...p, ...changes } : p))
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
    onSuccess: ({ liked, count }) => patch({ likedByMe: liked, likeCount: count }),
    onError: (_err, _vars, prev) => prev && patch(prev),
  });

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
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
            <span>12</span> Comment
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
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
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
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form">
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
                  placeholder="Write a comment"
                  id={`floatingTextarea${post.id}`}
                ></textarea>
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <button className="_feed_inner_comment_box_icon_btn">
                <Microphone />
              </button>
              <button className="_feed_inner_comment_box_icon_btn">
                <Camera />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="_timline_comment_main">
        <div className="_comment_main">
          <div className="_comment_image">
            <a href="profile.html" className="_comment_image_link">
              <img
                src="/assets/images/txt_img.png"
                alt=""
                className="_comment_img1"
              />
            </a>
          </div>
          <div className="_comment_area">
            <div className="_comment_details">
              <div className="_comment_details_top">
                <div className="_comment_name">
                  <a href="profile.html ">
                    <h4 className="_comment_name_title">Radovan SkillArena</h4>
                  </a>
                </div>
              </div>
              <div className="_comment_status">
                <p className="_comment_status_text">
                  <span>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </span>
                </p>
              </div>
              <div className="_total_reactions">
                <div className="_total_react">
                  <span className="_reaction_like">
                    <ThumbsUp />
                  </span>
                </div>
                <span className="_total">198</span>
              </div>
              <div className="_comment_reply">
                <div className="_comment_reply_num">
                  <ul className="_comment_reply_list">
                    <li>
                      <span>Like.</span>
                    </li>
                    <li>
                      <span>Reply.</span>
                    </li>
                    <li>
                      <span>Share</span>
                    </li>
                    <li>
                      <span className="_time_link">.21m</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="_feed_inner_comment_box">
              <form className="_feed_inner_comment_box_form">
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
                      placeholder="Write a comment"
                      id={`floatingTextarea2-${post.id}`}
                    ></textarea>
                  </div>
                </div>
                <div className="_feed_inner_comment_box_icon">
                  <button className="_feed_inner_comment_box_icon_btn">
                    <Microphone />
                  </button>
                  <button className="_feed_inner_comment_box_icon_btn">
                    <Camera />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MAX_VISIBLE_LIKERS = 5;

function Likers({
  likers,
  count,
}: {
  likers: FeedPost["topLikers"];
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
