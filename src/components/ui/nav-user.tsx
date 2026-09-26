"use client"

import { useRouter } from "next/navigation"
import { Avatar } from "@base-ui/react/avatar"
import { Menu } from "@base-ui/react/menu"
import { ChevronUpIcon, LogOutIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export interface SidebarUser {
  name: string
  role: string
  avatarUrl?: string
}

interface NavUserProps {
  user: SidebarUser
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter()

  // TODO: ganti dengan logout ke API (hapus token/session) saat auth sudah ada
  const handleLogout = () => {
    router.push("/")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu.Root>
          <Menu.Trigger
            render={
              <SidebarMenuButton className="h-auto gap-3 px-3 py-2.5 hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit data-open:hover:bg-transparent data-open:hover:text-inherit" />
            }
          >
            <Avatar.Root className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20">
              {user.avatarUrl && (
                <Avatar.Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="size-full object-cover"
                />
              )}
              <Avatar.Fallback className="text-sm font-semibold text-white">
                {getInitials(user.name)}
              </Avatar.Fallback>
            </Avatar.Root>

            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold">{user.name}</span>
              <span className="truncate text-xs opacity-70">{user.role}</span>
            </div>

            <ChevronUpIcon
              aria-hidden="true"
              className="ml-auto size-4 shrink-0 transition-transform in-data-popup-open:rotate-180"
            />
          </Menu.Trigger>

          <Menu.Portal>
            <Menu.Positioner side="top" align="end" sideOffset={8} className="z-50">
              <Menu.Popup className="min-w-48 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none">
                <Menu.Item
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 outline-none select-none data-highlighted:bg-red-50"
                >
                  <LogOutIcon aria-hidden="true" className="size-4" />
                  Logout
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
