import * as React from "react"

import { fetchCurrentUser, type CurrentUser } from "@/lib/api/user"

interface UseCurrentUserResult {
  user: CurrentUser | null
  isLoading: boolean
  error: string | null
}

// Profil user yang sedang login, diambil sekali saat komponen dipasang
export function useCurrentUser(): UseCurrentUserResult {
  const [state, setState] = React.useState<UseCurrentUserResult>({
    user: null,
    isLoading: true,
    error: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchCurrentUser(controller.signal)
      .then((user) => setState({ user, isLoading: false, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState({ user: null, isLoading: false, error: message })
      })

    return () => controller.abort()
  }, [])

  return state
}
