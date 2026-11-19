import * as React from "react"

import { CATEGORY_FETCH_LIMIT, fetchCategories, type Category } from "@/lib/api/category"
import { useTransactionRevision } from "@/components/header/transaction-revision-context"

interface UseCategoriesResult {
  categories: Category[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

interface CategoriesState {
  revision: number
  version: number // versi request milik hasil terakhir
  categories: Category[]
  error: string | null
}

// Fetch hanya berjalan saat `enabled` (mis. dialog sedang terbuka)
export function useCategories(
  enabled: boolean,
  limit: number | null = CATEGORY_FETCH_LIMIT
): UseCategoriesResult {
  const { revision } = useTransactionRevision()
  const [version, setVersion] = React.useState(0)
  const [state, setState] = React.useState<CategoriesState>({
    version: -1,
    revision: -1,
    categories: [],
    error: null,
  })

  React.useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()

    fetchCategories(limit, controller.signal)
      .then((categories) => {
        if (!controller.signal.aborted) setState({ revision, version, categories, error: null })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, revision, version, error: message }))
      })

    return () => controller.abort()
  }, [enabled, limit, revision, version])

  const reload = React.useCallback(() => setVersion((v) => v + 1), [])

  return {
    categories: state.categories,
    isLoading: enabled && (state.version !== version || state.revision !== revision),
    error: state.error,
    reload,
  }
}

export function useCategoriesById() {
  const { categories } = useCategories(true, null)
  return React.useMemo(() => new Map(categories.map(category => [category.id, category])), [categories])
}
