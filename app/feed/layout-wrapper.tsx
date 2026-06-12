"use client";

import { useState } from "react";
import { Moon, Sun } from "@/icons";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  return (
    <div
      className={`_layout _layout_main_wrapper${dark ? " _dark_wrapper" : ""}`}
    >
      <div className="_layout_mode_swithing_btn">
        <button
          type="button"
          className="_layout_swithing_btn_link"
          onClick={() => setDark(!dark)}
        >
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round"></div>
          </div>
          <div className="_layout_change_btn_ic1">
            <Moon />
          </div>
          <div className="_layout_change_btn_ic2">
            <Sun />
          </div>
        </button>
      </div>
      {children}
    </div>
  );
}
