"use client"

import { useState } from "react"
import DarkModeMenuLogo from "@/components/images/icons/moon-01.svg"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

// Visual-only toggle: switches the knob position but does not change the theme yet.
export function DarkModeToggle() {
  const [isOn, setIsOn] = useState(false)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        role="switch"
        aria-checked={isOn}
        onClick={() => setIsOn((prev) => !prev)}
        className="gap-3 px-3 py-2.5 h-auto cursor-pointer hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit"
      >
        <span
          aria-hidden="true"
          className="size-6 shrink-0 bg-white"
          style={{
            maskImage: `url(${DarkModeMenuLogo.src})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
        <span className="text-sm font-medium">Dark mode</span>

        <span
          aria-hidden="true"
          className={`ml-auto flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
            isOn ? "bg-indigo-600" : "bg-white/30"
          }`}
        >
          <span
            className={`size-4 rounded-full bg-white shadow-sm transition-transform ${
              isOn ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
