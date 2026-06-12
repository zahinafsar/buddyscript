"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Article, Event, Pen, Photo, Send, Video } from "@/icons";
import { api } from "@/lib/api";
import { postsQuery } from "@/lib/queries";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Avatar } from "./avatar";

type Visibility = "public" | "private";

export function CreatePost({ userName }: { userName: string }) {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const upload = useFileUpload();

  function clearImage() {
    upload.reset();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api("posts", {
        method: "POST",
        body: { content, visibility, imageKey: upload.key ?? undefined },
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          data && typeof data === "object" && "error" in data
            ? String(data.error)
            : "Failed to create post.";
        throw new Error(message);
      }
      return data;
    },
    onSuccess: () => {
      setContent("");
      setVisibility("public");
      setError(null);
      clearImage();
      queryClient.invalidateQueries({ queryKey: postsQuery.all });
    },
    onError: (err) => setError(err.message),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      clearImage();
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setError(null);
    upload.upload(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Post content is required.");
      return;
    }
    if (upload.isUploading) {
      setError("Wait for the image upload to finish.");
      return;
    }
    if (upload.error) {
      setError("Image upload failed. Remove the image or pick another one.");
      return;
    }
    mutate();
  }

  return (
    <div className="_feed_inner_text_area  _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <form onSubmit={handleSubmit}>
        <div className="_feed_inner_text_area_box">
          <div className="_feed_inner_text_area_box_image">
            <Avatar name={userName} size={40} />
          </div>
          <div className="form-floating _feed_inner_text_area_box_form ">
            <textarea
              className="form-control _textarea"
              placeholder="Leave a comment here"
              id="floatingTextarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <label className="_feed_textarea_label" htmlFor="floatingTextarea">
              Write something ...
              <Pen />
            </label>
          </div>
        </div>
        {preview && (
          <div style={{ marginTop: "12px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={preview}
                alt="Selected image preview"
                style={{
                  maxWidth: "160px",
                  maxHeight: "120px",
                  borderRadius: "6px",
                  display: "block",
                  opacity: upload.isUploading ? 0.6 : 1,
                }}
              />
              <button
                type="button"
                aria-label="Remove image"
                onClick={clearImage}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  border: "none",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  lineHeight: "20px",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            {upload.isUploading && (
              <div
                className="progress"
                style={{ maxWidth: "160px", height: "6px", marginTop: "6px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${upload.progress}%` }}
                  aria-valuenow={upload.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}
            {upload.error && (
              <p style={{ color: "#e0245e", marginTop: "6px" }}>
                {upload.error}
              </p>
            )}
          </div>
        )}
        {error && (
          <p style={{ color: "#e0245e", marginTop: "8px" }}>{error}</p>
        )}
        <div className="_feed_inner_text_area_bottom">
          <div className="_feed_inner_text_area_item">
            <div className="_feed_inner_text_area_bottom_photo _feed_common">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
                onClick={() => fileRef.current?.click()}
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <Photo />
                </span>
                Photo
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_video _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <Video />
                </span>
                Video
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_event _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <Event />
                </span>
                Event
              </button>
            </div>
            {/* <div className="_feed_inner_text_area_bottom_article _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <Article />
                </span>
                Article
              </button>
            </div> */}
            <div className="_feed_inner_text_area_bottom_event _feed_common">
              <select
                className="form-select"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                aria-label="Post visibility"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <div className="_feed_inner_text_area_btn">
            <button
              type="submit"
              disabled={isPending}
              className="_feed_inner_text_area_btn_link"
            >
              <Send /> <span>{isPending ? "Posting..." : "Post"}</span>
            </button>
          </div>
        </div>
        <div className="_feed_inner_text_area_bottom_mobile">
          <div className="_feed_inner_text_mobile">
            <div className="_feed_inner_text_area_item">
              <div className="_feed_inner_text_area_bottom_photo _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                  onClick={() => fileRef.current?.click()}
                >
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    <Photo />
                  </span>
                </button>
              </div>
              <div className="_feed_inner_text_area_bottom_video _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                >
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    <Video />
                  </span>
                </button>
              </div>
              <div className="_feed_inner_text_area_bottom_event _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                >
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    <Event />
                  </span>
                </button>
              </div>
              <div className="_feed_inner_text_area_bottom_article _feed_common">
                <button
                  type="button"
                  className="_feed_inner_text_area_bottom_photo_link"
                >
                  <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                    <Article />
                  </span>
                </button>
              </div>
            </div>
            <div className="_feed_inner_text_area_btn">
              <button
                type="submit"
                disabled={isPending || upload.isUploading}
                className="_feed_inner_text_area_btn_link"
              >
                <Send />{" "}
                <span>
                  {upload.isUploading
                    ? "Uploading..."
                    : isPending
                      ? "Posting..."
                      : "Post"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
