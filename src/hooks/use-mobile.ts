import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_SIDEBAR_BREAKPOINT = 1024

const getServerSnapshot = () => false

function useMediaQuery(query: string) {
  const subscribe = React.useCallback((onChange: () => void) => {
    const mql = window.matchMedia(query)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query])

  // SSR and the first hydration render use the same value; React then reads the viewport.
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}

// Sidebar jadi panel layar penuh pada mobile dan tablet; desktop tetap memakai sidebar tetap.
export function useIsTabletOrMobile() {
  return useMediaQuery(`(max-width: ${TABLET_SIDEBAR_BREAKPOINT - 1}px)`)
}
