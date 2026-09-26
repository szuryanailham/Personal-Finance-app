import * as React from "react"

const DEFAULT_DEBOUNCE_MS = 500

// Nilai baru hanya diteruskan setelah tidak berubah selama `delay` ms
export function useDebouncedValue<T>(value: T, delay = DEFAULT_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
