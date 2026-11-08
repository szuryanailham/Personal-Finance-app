"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import sidebarLogo from "@/components/images/icons/logo-dashboard.svg"
import anylisisMenuLogo from "@/components/images/icons/bar-line-chart.svg"
import TransactionMenuLogo from "@/components/images/icons/wallet-02.svg"
import SettingMenuLogo from "@/components/images/icons/settings-01.svg"
import SecurityMenuLogo from "@/components/images/icons/shield-tick.svg"
import HelpCenterMenuLogo from "@/components/images/icons/help-circle.svg"

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
import { DarkModeToggle } from "@/components/sidebar/dark-mode-toggle"


const CURRENT_USER: SidebarUser = {
  name: "User",
  role: "User",
  avatarUrl: "https://github.com/maxleiter.png",
}

const ICON_SQUARE_COLOR =
  "bg-current transition-colors"

export function AppSidebar() {
  const pathname = usePathname()
  const isMenuActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Sidebar className="overflow-hidden rounded-r-2xl">
      <SidebarHeader>
        <div className="mt-2 flex items-center justify-center p-2">
          <Image
            src={sidebarLogo}
            alt="Artoku"
            priority
            width={205}
            height={79}
            className="h-10 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isMenuActive("/dashboard")}
                render={<Link href="/dashboard" aria-current={isMenuActive("/dashboard") ? "page" : undefined} />}
                className="gap-3 px-3 h-auto"
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
                isActive={isMenuActive("/analysis")}
                render={<Link href="/analysis" aria-current={isMenuActive("/analysis") ? "page" : undefined} />}
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
                  Analisis
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

              {/* # Transction */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isMenuActive("/transaction")}
                render={<Link href="/transaction" aria-current={isMenuActive("/transaction") ? "page" : undefined} />}
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
                  Transaksi
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* settings */}

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isMenuActive("/settings")}
                render={<Link href="/settings" aria-current={isMenuActive("/settings") ? "page" : undefined} />}
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
                  Pengaturan
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
                  Keamanan
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

               {/* Help center */}

              <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isMenuActive("/guidance")}
                render={<Link href="/guidance" aria-current={isMenuActive("/guidance") ? "page" : undefined} />}
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
                  Pusat Panduan
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>


               {/* dark mode */}

              <DarkModeToggle />


          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={CURRENT_USER} />
      </SidebarFooter>
    </Sidebar>
  )
}
