import { LayoutWrapper } from "./layout-wrapper";
import { Nav } from "./nav";
import { Explore } from "./exploar";
import { SuggestedPeople } from "./suggested-people";
import { Events } from "./events";
import { Stories } from "./stories";
import { CreatePost } from "./create-post";
import { Posts } from "./posts";
import { MightLike } from "./might-like";
import { Friends } from "./friends";

export default function FeedPage() {
  return (
    <LayoutWrapper>
      <div className="_main_layout">
        <Nav />
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">
                  <Explore />
                  <SuggestedPeople />
                  <Events />
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <Stories />
                    <CreatePost />
                    <Posts />
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">
                  <MightLike />
                  <Friends />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
