import Link from "next/link";
import {
  ArrowLeftRightIcon,
  CalendarDaysIcon,
  ChartColumnIcon,
  DownloadIcon,
  LayoutDashboardIcon,
  UploadIcon,
  type LucideIcon,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Transaksi", href: "/transaction", icon: ArrowLeftRightIcon },
  { label: "Ringkasan", href: "/summary", icon: LayoutDashboardIcon },
  { label: "Analisis", href: "/analysis", icon: ChartColumnIcon },
  { label: "Tanggal", href: "/calender", icon: CalendarDaysIcon },
  { label: "Import", href: "/import", icon: UploadIcon },
  { label: "Export", href: "/export", icon: DownloadIcon },
];

export function MenuGrid() {
  return (
    <nav aria-label="Menu">
      <ul className="grid grid-cols-3 gap-y-5">
        {MENU_ITEMS.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex flex-col items-center gap-2 text-center transition-opacity active:opacity-60"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#14864A]/10 text-[#14864A]">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="text-xs font-medium text-slate-700">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
