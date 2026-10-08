import * as React from "react"

const HIDDEN_AMOUNTS_STORAGE_KEY = "summary-amounts-hidden"

const hiddenListeners = new Set<() => void>()

function subscribeHidden(listener: () => void): () => void {
  hiddenListeners.add(listener)
  // Sinkron antar tab: perubahan di tab lain ikut diterapkan
  const onStorage = (event: StorageEvent) => {
    if (event.key === HIDDEN_AMOUNTS_STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    hiddenListeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function readStoredHidden(): boolean {
  try {
    return window.localStorage.getItem(HIDDEN_AMOUNTS_STORAGE_KEY) === "true"
  } catch {
    return false // storage diblokir (mis. private mode)
  }
}

function writeStoredHidden(isHidden: boolean): void {
  try {
    window.localStorage.setItem(HIDDEN_AMOUNTS_STORAGE_KEY, String(isHidden))
  } catch {
    // storage penuh/diblokir: pilihan tidak tersimpan, tapi aplikasi tetap jalan
  }
  hiddenListeners.forEach((listener) => listener())
}

// Saat SSR belum ada localStorage, jadi server & hydration awal selalu menampilkan nominal
const getServerHiddenSnapshot = (): boolean => false

// Satu state bersama untuk semua summary card: sembunyikan satu = sembunyikan semua
export function useHiddenAmounts() {
  const isHidden = React.useSyncExternalStore(subscribeHidden, readStoredHidden, getServerHiddenSnapshot)
  const toggleHidden = React.useCallback(() => writeStoredHidden(!readStoredHidden()), [])

  return { isHidden, toggleHidden }
}
