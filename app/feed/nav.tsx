"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  DotsVertical,
  Gear,
  Help,
  Logout,
  BellMobile,
  Chat,
  ChatMobile,
  FriendRequests,
  FriendRequestsMobile,
  Home,
  HomeMobile,
  MobileMenu,
  Search,
} from "@/icons";
import { logout } from "@/app/(auth)/actions";
import { Avatar } from "./avatar";

export type NavUser = {
  name: string;
  email: string;
};

export function Nav({ user }: { user: NavUser }) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
        <div className="container _custom_container">
          <div className="_logo_wrap">
            <a className="navbar-brand" href="/feed">
              <img
                src="/assets/images/logo.svg"
                alt="Image"
                className="_nav_logo"
              />
            </a>
          </div>
          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="_header_form ms-auto">
              <form className="_header_form_grp">
                <Search className="_header_form_svg" />
                <input
                  className="form-control me-2 _inpt1"
                  type="search"
                  placeholder="input search text"
                  aria-label="Search"
                />
              </form>
            </div>
            <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
              <li className="nav-item _header_nav_item">
                <a
                  className="nav-link _header_nav_link_active _header_nav_link"
                  aria-current="page"
                  href="/feed"
                >
                  <Home />
                </a>
              </li>
              <li className="nav-item _header_nav_item">
                <a
                  className="nav-link _header_nav_link"
                  aria-current="page"
                  href="friend-request.html"
                >
                  <FriendRequests />
                </a>
              </li>
              <NotificationDropdown />
              <li className="nav-item _header_nav_item">
                <a
                  className="nav-link _header_nav_link"
                  aria-current="page"
                  href="chat.html"
                >
                  <Chat /> <span className="_counting">2</span>
                </a>
              </li>
            </ul>
            <ProfileDropdown user={user} />
          </div>
        </div>
      </nav>
      <div className="_header_mobile_menu">
        <div className="_header_mobile_menu_wrap">
          <div className="container">
            <div className="_header_mobile_menu">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="_header_mobile_menu_top_inner">
                    <div className="_header_mobile_menu_logo">
                      <a href="/feed" className="_mobile_logo_link">
                        <img
                          src="/assets/images/logo.svg"
                          alt="Image"
                          className="_nav_logo"
                        />
                      </a>
                    </div>
                    <div className="_header_mobile_menu_right">
                      <form className="_header_form_grp">
                        <a href="#0" className="_header_mobile_search">
                          <Search />
                        </a>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="_mobile_navigation_bottom_wrapper">
        <div className="_mobile_navigation_bottom_wrap">
          <div className="conatiner">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12">
                <ul className="_mobile_navigation_bottom_list">
                  <li className="_mobile_navigation_bottom_item">
                    <a
                      href="/feed"
                      className="_mobile_navigation_bottom_link _mobile_navigation_bottom_link_active"
                    >
                      <HomeMobile />
                    </a>
                  </li>
                  <li className="_mobile_navigation_bottom_item">
                    <a
                      href="friend-request.html"
                      className="_mobile_navigation_bottom_link"
                    >
                      <FriendRequestsMobile />
                    </a>
                  </li>
                  <li className="_mobile_navigation_bottom_item">
                    <a href="no" className="_mobile_navigation_bottom_link">
                      <BellMobile />
                      <span className="_counting">6</span>
                    </a>
                  </li>
                  <li className="_mobile_navigation_bottom_item">
                    <a
                      href="chat_list(for_mbl).html"
                      className="_mobile_navigation_bottom_link"
                    >
                      <ChatMobile />
                      <span className="_counting">2</span>
                    </a>
                  </li>
                  <div className="_header_mobile_toggle">
                    <form action="/mobileMenu.html">
                      <button
                        type="submit"
                        className="_header_mobile_btn_link"
                        value="go to mobile menu"
                      >
                        <MobileMenu />
                      </button>
                    </form>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item _header_nav_item">
      <span
        className="nav-link _header_nav_link _header_notify_btn"
        onClick={() => setOpen(!open)}
      >
        <Bell />
        <span className="_counting">6</span>
        <div
          className={`_notification_dropdown${open ? " show" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="_notifications_content">
            <h4 className="_notifications_content_title">Notifications</h4>
            <div className="_notification_box_right">
              <button type="button" className="_notification_box_right_link">
                <DotsVertical />
              </button>
              <div className="_notifications_drop_right">
                <ul className="_notification_list">
                  <li className="_notification_item">
                    <span className="_notification_link">Mark as all read</span>
                  </li>
                  <li className="_notification_item">
                    <span className="_notification_link">
                      Notifivations seetings
                    </span>
                  </li>
                  <li className="_notification_item">
                    <span className="_notification_link">
                      Open Notifications
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="_notifications_drop_box">
            <div className="_notifications_drop_btn_grp">
              <button className="_notifications_btn_link">All</button>
              <button className="_notifications_btn_link1">Unread</button>
            </div>
            <div className="_notifications_all">
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/friend-req.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    <span className="_notify_txt_link">Steve Jobs</span>
                    posted a link in your timeline.
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
              <div className="_notification_box">
                <div className="_notification_image">
                  <img
                    src="/assets/images/profile-1.png"
                    alt="Image"
                    className="_notify_img"
                  />
                </div>
                <div className="_notification_txt">
                  <p className="_notification_para">
                    An admin changed the name of the group
                    <span className="_notify_txt_link">Freelacer usa</span>
                    to
                    <span className="_notify_txt_link">Freelacer usa</span>
                  </p>
                  <div className="_nitification_time">
                    <span>42 miniutes ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    </li>
  );
}

export function ProfileDropdown({ user }: { user: NavUser }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="_header_nav_profile">
      <div className="_header_nav_profile_image">
        <Avatar name={user.name} size={24} />
      </div>
      <div className="_header_nav_dropdown">
        <p className="_header_nav_para">{user.name}</p>
        <button
          className="_header_nav_dropdown_btn _dropdown_toggle"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <ChevronDown />
        </button>
      </div>
      <div
        className={`_nav_profile_dropdown _profile_dropdown${
          open ? " show" : ""
        }`}
      >
        <div className="_nav_profile_dropdown_info">
          <div className="_nav_profile_dropdown_image">
            <Avatar name={user.name} size={54} />
          </div>
          <div className="_nav_profile_dropdown_info_txt">
            <h4 className="_nav_dropdown_title">{user.name}</h4>
            <a href="profile.html" className="_nav_drop_profile">
              View Profile
            </a>
          </div>
        </div>
        <hr />
        <ul className="_nav_dropdown_list">
          <li className="_nav_dropdown_list_item">
            <a href="#0" className="_nav_dropdown_link">
              <div className="_nav_drop_info">
                <span>
                  <Gear />
                </span>
                Settings
              </div>
              <button type="submit" className="_nav_drop_btn_link">
                <ChevronRight />
              </button>
            </a>
          </li>
          <li className="_nav_dropdown_list_item">
            <a href="#0" className="_nav_dropdown_link">
              <div className="_nav_drop_info">
                <span>
                  <Help />
                </span>
                Help & Support
              </div>
              <button type="submit" className="_nav_drop_btn_link">
                <ChevronRight />
              </button>
            </a>
          </li>
          <li className="_nav_dropdown_list_item">
            <a
              href="#0"
              className="_nav_dropdown_link"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <div className="_nav_drop_info">
                <span>
                  <Logout />
                </span>
                Log Out
              </div>
              <button type="submit" className="_nav_drop_btn_link">
                <ChevronRight />
              </button>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
