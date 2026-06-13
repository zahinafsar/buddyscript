import { ArrowRight, Plus, PlusRound } from "@/icons";

export function Stories() {
  return (
    <>
      <div className="_feed_inner_ppl_card _mar_b16">
        <div className="_feed_inner_story_arrow">
          <button type="button" className="_feed_inner_story_arrow_btn">
            <ArrowRight />
          </button>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
            <div className="_feed_inner_profile_story _b_radious6 ">
              <div className="_feed_inner_profile_story_image">
                <img
                  src="/assets/images/card_ppl1.png"
                  alt="Image"
                  className="_profile_story_img"
                />
                <div className="_feed_inner_story_txt">
                  <div className="_feed_inner_story_btn">
                    <button className="_feed_inner_story_btn_link">
                      <Plus />
                    </button>
                  </div>
                  <p className="_feed_inner_story_para">Your Story</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img
                  src="/assets/images/card_ppl2.png"
                  alt="Image"
                  className="_public_story_img"
                />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img
                    src="/assets/images/mini_pic.png"
                    alt="Image"
                    className="_public_mini_img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_mobile_none">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img
                  src="/assets/images/card_ppl3.png"
                  alt="Image"
                  className="_public_story_img"
                />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img
                    src="/assets/images/mini_pic.png"
                    alt="Image"
                    className="_public_mini_img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_none">
            <div className="_feed_inner_public_story _b_radious6">
              <div className="_feed_inner_public_story_image">
                <img
                  src="/assets/images/card_ppl4.png"
                  alt="Image"
                  className="_public_story_img"
                />
                <div className="_feed_inner_pulic_story_txt">
                  <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                </div>
                <div className="_feed_inner_public_mini">
                  <img
                    src="/assets/images/mini_pic.png"
                    alt="Image"
                    className="_public_mini_img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="_feed_inner_ppl_card_mobile _mar_b16">
        <div className="_feed_inner_ppl_card_area">
          <ul className="_feed_inner_ppl_card_area_list">
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story">
                  <img
                    src="/assets/images/mobile_story_img.png"
                    alt="Image"
                    className="_card_story_img"
                  />
                  <div className="_feed_inner_ppl_btn">
                    <button className="_feed_inner_ppl_btn_link" type="button">
                      <PlusRound />
                    </button>
                  </div>
                </div>
                <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_active">
                  <img
                    src="/assets/images/mobile_story_img1.png"
                    alt="Image"
                    className="_card_story_img1"
                  />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_inactive">
                  <img
                    src="/assets/images/mobile_story_img2.png"
                    alt="Image"
                    className="_card_story_img1"
                  />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_active">
                    <img
                      src="/assets/images/mobile_story_img1.png"
                      alt="Image"
                      className="_card_story_img1"
                    />
                  </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_inactive">
                  <img
                    src="/assets/images/mobile_story_img2.png"
                    alt="Image"
                    className="_card_story_img1"
                  />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_active">
                    <img
                      src="/assets/images/mobile_story_img1.png"
                      alt="Image"
                      className="_card_story_img1"
                    />
                  </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story">
                  <img
                    src="/assets/images/mobile_story_img.png"
                    alt="Image"
                    className="_card_story_img"
                  />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story_active">
                  <img
                    src="/assets/images/mobile_story_img1.png"
                    alt="Image"
                    className="_card_story_img1"
                  />
                </div>
                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
