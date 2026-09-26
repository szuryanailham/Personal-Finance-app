import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TablePaginationProps {
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
}

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

export function TablePagination({
  currentPage,
  totalPage,
  onPageChange,
  disabled = false,
  className,
}: TablePaginationProps) {
  if (totalPage <= 1) return null

  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPage

  return (
    <nav
      aria-label="Pagination"
      className={cn("mt-4 flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>
      {buildPageItems(currentPage, totalPage).map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
            variant={item === currentPage ? "default" : "ghost"}
            size="sm"
            disabled={disabled}
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
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
