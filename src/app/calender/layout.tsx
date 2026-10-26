import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileCalendarPage } from "@/components/mobile/mobile-calendar-page";

export const metadata: Metadata = {
  title: "Kalender",
};

export default function CalendarLayout({ children }: LayoutProps<"/calender">) {
  return (
    <AppShell title="Kalender" mobile={<MobileCalendarPage />}>
      {children}
    </AppShell>
  );
}
