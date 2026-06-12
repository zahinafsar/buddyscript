"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BellActive,
  Delete,
  DotsVertical,
  Edit,
  Hide,
  Save,
  Camera,
  Comment,
  Haha,
  Microphone,
  Share,
} from "@/icons";
import { timeAgo } from "@/lib/format";
import { postsQuery } from "@/lib/queries";

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
        <div
          key={post.id}
          className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
        >
          <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
            <div className="_feed_inner_timeline_post_top">
              <div className="_feed_inner_timeline_post_box">
                <div className="_feed_inner_timeline_post_box_image">
                  <img
                    src="/assets/images/post_img.png"
                    alt=""
                    className="_post_img"
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
              <img
                src="/assets/images/react_img1.png"
                alt="Image"
                className="_react_img1"
              />
              <img
                src="/assets/images/react_img2.png"
                alt="Image"
                className="_react_img"
              />
              <img
                src="/assets/images/react_img3.png"
                alt="Image"
                className="_react_img _rect_img_mbl_none"
              />
              <img
                src="/assets/images/react_img4.png"
                alt="Image"
                className="_react_img _rect_img_mbl_none"
              />
              <img
                src="/assets/images/react_img5.png"
                alt="Image"
                className="_react_img _rect_img_mbl_none"
              />
              <p className="_feed_inner_timeline_total_reacts_para">9+</p>
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
            <button className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_reaction_active">
              <span className="_feed_inner_timeline_reaction_link">
                <span>
                  <Haha />
                  Haha
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
                      id={`commentTextarea${post.id}`}
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
      ))}
    </>
  );
}

export function PostDropdown() {
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
