import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export const PAGE_SIZE_OPTIONS = [10, 50, 100] as const
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0]

interface TablePaginationProps {
  currentPage: number
  totalPage: number
  pageSize: number
  /** Jumlah baris yang tampil di halaman ini */
  itemCount: number
  /** Total baris di semua halaman; tanpa ini teks "dari N" disembunyikan */
  totalItem?: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  /** Pilihan jumlah baris per halaman; default PAGE_SIZE_OPTIONS */
  pageSizeOptions?: readonly number[]
  disabled?: boolean
  className?: string
}

const NAV_BUTTON_CLASS =
  "border-[#6359E9] text-[#6359E9] hover:bg-[#6359E9]/10 hover:text-[#6359E9]"
const ACTIVE_PAGE_CLASS = "bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
const INACTIVE_PAGE_CLASS = "text-[#6359E9] hover:bg-[#6359E9]/10 hover:text-[#6359E9]"
// Teks Prev/Next disembunyikan di mobile agar nomor halaman muat dalam satu baris
const NAV_LABEL_CLASS = "max-md:hidden"

// Jumlah nomor halaman yang tampil di sekitar halaman aktif
const SIBLING_COUNT = 1

type PageItem = number | "ellipsis-left" | "ellipsis-right"

// Contoh: halaman 5 dari 10 -> [1, …, 4, 5, 6, …, 10]
function buildPageItems(currentPage: number, totalPage: number): PageItem[] {
  const start = Math.max(2, currentPage - SIBLING_COUNT)
  const end = Math.min(totalPage - 1, currentPage + SIBLING_COUNT)
  const middle = Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i)

  return [
    1,
    ...(start > 2 ? (["ellipsis-left"] as const) : []),
    ...middle,
    ...(end < totalPage - 1 ? (["ellipsis-right"] as const) : []),
    ...(totalPage > 1 ? [totalPage] : []),
  ]
}

// Contoh: halaman 2, size 10, 7 baris, total 17 -> "Menampilkan 11–17 dari 17"
function buildRangeLabel(
  currentPage: number,
  pageSize: number,
  itemCount: number,
  totalItem?: number
): string {
  if (itemCount === 0) return "Tidak ada data"
  const from = (currentPage - 1) * pageSize + 1
  const to = from + itemCount - 1
  const total = totalItem === undefined ? "" : ` dari ${totalItem.toLocaleString("id-ID")}`
  return `Menampilkan ${from}–${to}${total}`
}

export function TablePagination({
  currentPage,
  totalPage,
  pageSize,
  itemCount,
  totalItem,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  disabled = false,
  className,
}: TablePaginationProps) {
  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPage

  return (
    <div
      className={cn(
        "mt-4 flex flex-col items-center gap-3 text-sm text-slate-500 sm:flex-row sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span>Baris per halaman</span>
          <Select
            value={pageSize}
            onValueChange={(value) => value !== null && onPageSizeChange(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger size="sm" aria-label="Baris per halaman" className="min-w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Teks rentang data disembunyikan di mobile agar baris pagination tetap ringkas */}
        <span aria-live="polite" className="max-md:hidden">
          {buildRangeLabel(currentPage, pageSize, itemCount, totalItem)}
        </span>
      </div>

      {totalPage > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || isFirst}
            className={NAV_BUTTON_CLASS}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
            <span className={NAV_LABEL_CLASS}>Prev</span>
          </Button>
          {buildPageItems(currentPage, totalPage).map((item) =>
            typeof item === "number" ? (
              <Button
                key={item}
                variant={item === currentPage ? "default" : "ghost"}
                size="sm"
                disabled={disabled}
                className={item === currentPage ? ACTIVE_PAGE_CLASS : INACTIVE_PAGE_CLASS}
                aria-current={item === currentPage ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            ) : (
              <span key={item} className="px-2 text-sm text-slate-400">
                …
              </span>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || isLast}
            className={NAV_BUTTON_CLASS}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <span className={NAV_LABEL_CLASS}>Next</span>
            <ChevronRightIcon />
          </Button>
        </nav>
      )}
    </div>
  )
}
