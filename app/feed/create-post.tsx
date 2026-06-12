import { Article, Event, Pen, Photo, Send, Video } from "@/icons";

export function CreatePost() {
  return (
    <div className="_feed_inner_text_area  _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img
            src="/assets/images/txt_img.png"
            alt="Image"
            className="_txt_img"
          />
        </div>
        <div className="form-floating _feed_inner_text_area_box_form ">
          <textarea
            className="form-control _textarea"
            placeholder="Leave a comment here"
            id="floatingTextarea"
          ></textarea>
          <label className="_feed_textarea_label" htmlFor="floatingTextarea">
            Write something ...
            <Pen />
          </label>
        </div>
      </div>
      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          <div className="_feed_inner_text_area_bottom_photo _feed_common">
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
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
          <div className="_feed_inner_text_area_bottom_article _feed_common">
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
            >
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                <Article />
              </span>
              Article
            </button>
          </div>
        </div>
        <div className="_feed_inner_text_area_btn">
          <button type="button" className="_feed_inner_text_area_btn_link">
            <Send /> <span>Post</span>
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
            <button type="button" className="_feed_inner_text_area_btn_link">
              <Send /> <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
