import {
  Bookmarks,
  FindFriends,
  Gaming,
  Group,
  Insights,
  Learning,
  SavePost,
  Settings,
} from "@/icons";

export function Explore() {
  return (
    <div className="_layout_left_sidebar_inner">
      <div className="_left_inner_area_explore _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
        <h4 className="_left_inner_area_explore_title _title5  _mar_b24">
          Explore
        </h4>
        <ul className="_left_inner_area_explore_list">
          <li className="_left_inner_area_explore_item _explore_item">
            <a href="#0" className="_left_inner_area_explore_link">
              <Learning />
              Learning
            </a>{" "}
            <span className="_left_inner_area_explore_link_txt">New</span>
          </li>
          <li className="_left_inner_area_explore_item">
            <a href="#0" className="_left_inner_area_explore_link">
              <Insights />
              Insights
            </a>
          </li>
          <li className="_left_inner_area_explore_item">
            <a
              href="find-friends.html"
              className="_left_inner_area_explore_link"
            >
              <FindFriends />
              Find friends
            </a>
          </li>
          <li className="_left_inner_area_explore_item">
            <a href="#0" className="_left_inner_area_explore_link">
              <Bookmarks />
              Bookmarks
            </a>
          </li>
          <li className="_left_inner_area_explore_item">
            <a href="group.html" className="_left_inner_area_explore_link">
              <Group />
              Group
            </a>
          </li>
          <li className="_left_inner_area_explore_item _explore_item">
            <a href="#0" className="_left_inner_area_explore_link">
              <Gaming />
              Gaming
            </a>{" "}
            <span className="_left_inner_area_explore_link_txt">New</span>
          </li>
          <li className="_left_inner_area_explore_item">
            <a href="#0" className="_left_inner_area_explore_link">
              <Settings />
              Settings
            </a>
          </li>
          <li className="_left_inner_area_explore_item">
            <a href="#0" className="_left_inner_area_explore_link">
              <SavePost />
              Save post
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
