import { driver, type Driver } from "driver.js"
import type { TutorialStep } from "./tutorials"

export function visibleTarget(name: string): Element | undefined {
  return [...document.querySelectorAll(`[data-guidance="${name}"]`)].find((element) => {
    const style = getComputedStyle(element)
    return element.getClientRects().length > 0 && style.visibility !== "hidden" &&
      element.getAttribute("aria-busy") !== "true"
  })
}

/** Wait for route commits, hydration and the visible responsive tree; never highlight a missing target. */
export async function waitForTarget(
  path: string,
  target: string | undefined,
  signal: AbortSignal,
): Promise<Element | undefined> {
  const deadline = Date.now() + 15000
  while (!signal.aborted && Date.now() < deadline) {
    if (window.location.pathname === path && document.querySelector("[data-guidance-shell]")) {
      const element = target ? visibleTarget(target) : undefined
      if (!target || element) return element
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  if (signal.aborted) throw new DOMException("Aborted", "AbortError")
  throw new Error("Fitur panduan belum siap. Silakan coba lagi dari Pusat Panduan.")
}

export function createTutorialRunner({ steps, navigate, onFinish, onError, onLoading }: {
  steps: TutorialStep[]
  navigate: (path: string) => void
  onFinish: () => void
  onError: (error: unknown) => void
  onLoading: (loading: boolean) => void
}) {
  let instance: Driver | undefined
  let pending: AbortController | undefined
  let stopped = false
  let index = 0

  function onKeyUp(event: KeyboardEvent) {
    const target = event.target
    if (target instanceof HTMLElement &&
      (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    event.stopImmediatePropagation()
    if (event.key === "ArrowRight") {
      if (index === steps.length - 1) finish()
      else void show(index + 1)
    } else if (index > 0) void show(index - 1)
  }

  function clear() {
    document.removeEventListener("keyup", onKeyUp, true)
    pending?.abort()
    if (instance) {
      instance.setConfig({ ...instance.getConfig(), onDestroyStarted: undefined, onDestroyed: undefined })
      instance.destroy()
      instance = undefined
    }
  }
  function destroy() {
    stopped = true
    clear()
    onLoading(false)
  }
  function finish() {
    if (stopped) return
    destroy()
    onFinish()
  }
  async function show(nextIndex: number) {
    if (stopped) return
    clear()
    index = nextIndex
    const step = steps[index]
    const mobile = window.matchMedia("(max-width: 767px)").matches
    const path = mobile ? step.mobilePath ?? step.path : step.path
    const target = mobile ? step.mobileTarget ?? step.target : step.target
    const controller = new AbortController()
    pending = controller
    onLoading(true)
    try {
      if (window.location.pathname !== path) navigate(path)
      const element = await waitForTarget(path, target, controller.signal)
      if (controller.signal.aborted || stopped) return
      onLoading(false)
      const last = index === steps.length - 1
      instance = driver({
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        smoothScroll: false,
        popoverClass: "artoku-guidance",
        stageRadius: 16,
        stagePadding: 6,
        overlayOpacity: 0.55,
        allowClose: true,
        disableActiveInteraction: false,
        allowKeyboardControl: true,
        onDestroyStarted: finish,
        // Keyboard arrows must use the same route-aware controls as the buttons.
        onNextClick: () => last ? finish() : void show(index + 1),
        onPrevClick: () => { if (index > 0) void show(index - 1) },
        onPopoverRender(popover) {
          popover.closeButton.setAttribute("aria-label", "Lewati tutorial")
          // Single-element highlights use custom controls for navigation across routes.
          popover.footer.style.display = "flex"
          popover.footerButtons.replaceChildren()
          popover.progress.textContent = `${index + 1} dari ${steps.length}`
          popover.progress.style.display = "block"
          const button = (text: string, action: () => void, className: string) => {
            const control = document.createElement("button")
            control.type = "button"
            control.textContent = text
            control.className = className
            control.onclick = action
            popover.footerButtons.append(control)
            return control
          }
          button("Lewati", finish, "artoku-guidance-skip")
          if (index > 0) button("Kembali", () => void show(index - 1), "driver-popover-prev-btn")
          const next = button(last ? "Selesai" : "Lanjut", () => last ? finish() : void show(index + 1), "driver-popover-next-btn")
          next.focus()
        },
      })
      // highlight() has no Driver tour index, so handle arrows for our route-aware steps.
      document.addEventListener("keyup", onKeyUp, true)
      instance.highlight({
        element,
        popover: { title: step.title, description: step.description, side: "bottom", align: "center", showButtons: ["close"] },
      })
    } catch (error) {
      if (controller.signal.aborted || stopped) return
      destroy()
      onError(error)
    }
  }
  return { start: () => void show(0), destroy, resume: () => void show(index), skip: finish }
}
