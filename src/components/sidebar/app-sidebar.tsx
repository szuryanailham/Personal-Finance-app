import Image from "next/image"
import Link from "next/link"
import sidebarLogo from "@/components/images/sidebar/sidebar-header.svg"
import anylisisMenuLogo from "@/components/images/icons/bar-line-chart.svg"
import accountMenuLogo from "@/components/images/icons/user-03.svg"
import TransactionMenuLogo from "@/components/images/icons/wallet-02.svg"
import SettingMenuLogo from "@/components/images/icons/settings-01.svg"
import SecurityMenuLogo from "@/components/images/icons/shield-tick.svg"
import HelpCenterMenuLogo from "@/components/images/icons/help-circle.svg"
import DarkModeMenuLogo from "@/components/images/icons/moon-01.svg"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser, type SidebarUser } from "@/components/ui/nav-user"


const CURRENT_USER: SidebarUser = {
  name: "User",
  role: "User",
  avatarUrl: "https://github.com/maxleiter.png",
}

const ICON_SQUARE_COLOR =
  "bg-white transition-colors group-hover/menu-button:bg-indigo-600 group-data-active/menu-button:bg-indigo-600"

export function AppSidebar() {
  return (
    <Sidebar className="overflow-hidden rounded-r-2xl">
      <SidebarHeader>
        <div className="flex items-center px-3 py-3">
          <Image
            src={sidebarLogo}
            alt="Smart Budget"
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/" />}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <div className="size-6 relative">
                  <div className={`size-2 left-[13.50px] top-[2px] absolute ${ICON_SQUARE_COLOR}`} />
                  <div className={`size-2 left-[13.50px] top-[13.50px] absolute ${ICON_SQUARE_COLOR}`} />
                  <div className={`size-2 left-[2px] top-[2px] absolute ${ICON_SQUARE_COLOR}`} />
                  <div className={`size-2 left-[2px] top-[13.50px] absolute ${ICON_SQUARE_COLOR}`} />
                  <div className={`size-6 left-[24px] top-[24px] absolute origin-top-left -rotate-180 opacity-0 ${ICON_SQUARE_COLOR}`} />
                </div>
                <span className="text-sm font-medium ">
                  Dashboard
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* #Anylisis */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard" />}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 ${ICON_SQUARE_COLOR}`}
                  style={{
                    maskImage: `url(${anylisisMenuLogo.src})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
                <span className="text-sm font-medium ">
                  Anylisis
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

              {/* # Transction */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/transaction" />}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 ${ICON_SQUARE_COLOR}`}
                  style={{
                    maskImage: `url(${TransactionMenuLogo.src})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
                <span className="text-sm font-medium ">
                  Transaction
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* account */}

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/account" />}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 ${ICON_SQUARE_COLOR}`}
                  style={{
                    maskImage: `url(${accountMenuLogo.src})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
                <span className="text-sm font-medium ">
                  Account
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>


            {/* settings */}

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/account" />}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 ${ICON_SQUARE_COLOR}`}
                  style={{
                    maskImage: `url(${SettingMenuLogo.src})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
                <span className="text-sm font-medium ">
                  Settings
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/*  Bar putih */}
            <li aria-hidden="true" className="mx-3 my-2 mt-7 h-px bg-white" />


            {/* Security */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard" />}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 ${ICON_SQUARE_COLOR}`}
                  style={{
                    maskImage: `url(${SecurityMenuLogo.src})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
                <span className="text-sm font-medium ">
                  Security
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

               {/* Help center */}

              <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard" />}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 ${ICON_SQUARE_COLOR}`}
                  style={{
                    maskImage: `url(${HelpCenterMenuLogo.src})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
                <span className="text-sm font-medium ">
                  Help Center
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>


               {/* dark mode */}

              <SidebarMenuItem>
              <SidebarMenuButton
                role="switch"
                aria-checked={false}
                className="gap-3 px-3 py-2.5 h-auto"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 ${ICON_SQUARE_COLOR}`}
                  style={{
                    maskImage: `url(${DarkModeMenuLogo.src})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
                <span className="text-sm font-medium ">
                  Dark mode
                </span>

                {/* Toggle (view only) */}
                <span
                  aria-hidden="true"
                  className="ml-auto flex h-5 w-9 shrink-0 items-center rounded-full bg-white/30 p-0.5"
                >
                  <span className="size-4 rounded-full bg-white shadow-sm" />
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>


          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={CURRENT_USER} />
      </SidebarFooter>
    </Sidebar>
  )
}