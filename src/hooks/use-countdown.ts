import { useCallback, useEffect, useRef, useState } from "react"

const TICK_MS = 1000

function secondsUntil(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / TICK_MS))
}

/** Hitung mundur berbasis deadline agar tetap akurat walau tab sempat tidak aktif */
export function useCountdown(initialSeconds: number) {
  const [deadline, setDeadline] = useState(() => Date.now() + initialSeconds * TICK_MS)
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  // Selalu deadline terbaru: tick dari interval lama yang belum sempat di-clear
  // tidak boleh menimpa secondsLeft dengan nilai deadline lama (penyebab timer berkedip)
  const deadlineRef = useRef(deadline)

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = secondsUntil(deadlineRef.current)
      setSecondsLeft(remaining)
      if (remaining === 0) clearInterval(id)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [deadline])

  const restart = useCallback((seconds: number) => {
    const next = Date.now() + seconds * TICK_MS
    deadlineRef.current = next
    setDeadline(next)
    setSecondsLeft(seconds)
  }, [])

  return { secondsLeft, isFinished: secondsLeft === 0, restart }
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}
