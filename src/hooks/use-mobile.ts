import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_SIDEBAR_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Sidebar jadi panel layar penuh pada mobile dan tablet; desktop tetap memakai sidebar tetap.
export function useIsTabletOrMobile() {
  const [isTabletOrMobile, setIsTabletOrMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${TABLET_SIDEBAR_BREAKPOINT - 1}px)`)
    const onChange = () => setIsTabletOrMobile(window.innerWidth < TABLET_SIDEBAR_BREAKPOINT)
    mql.addEventListener("change", onChange)
    setIsTabletOrMobile(window.innerWidth < TABLET_SIDEBAR_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTabletOrMobile
}
