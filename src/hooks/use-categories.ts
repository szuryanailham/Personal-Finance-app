import * as React from "react"

import { CATEGORY_FETCH_LIMIT, fetchCategories, type Category } from "@/lib/api/category"

interface UseCategoriesResult {
  categories: Category[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

interface CategoriesState {
  version: number // versi request milik hasil terakhir
  categories: Category[]
  error: string | null
}

// Fetch hanya berjalan saat `enabled` (mis. dialog sedang terbuka)
export function useCategories(
  enabled: boolean,
  limit: number = CATEGORY_FETCH_LIMIT
): UseCategoriesResult {
  const [version, setVersion] = React.useState(0)
  const [state, setState] = React.useState<CategoriesState>({
    version: -1,
    categories: [],
    error: null,
  })

  React.useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()

    fetchCategories(limit, controller.signal)
      .then((categories) => setState({ version, categories, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, version, error: message }))
      })

    return () => controller.abort()
  }, [enabled, limit, version])

  const reload = React.useCallback(() => setVersion((v) => v + 1), [])

  return {
    categories: state.categories,
    isLoading: enabled && state.version !== version,
    error: state.error,
    reload,
  }
}
