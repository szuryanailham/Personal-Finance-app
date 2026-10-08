import * as React from "react"
import type { ImportedTransaction } from "@/lib/api/transaction-import"

// Hasil import disimpan di sessionStorage agar halaman review tetap terisi setelah refresh
const STORAGE_KEY = "transaction-import-result"

const listeners = new Set<() => void>()

function readRaw(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeRaw(value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(STORAGE_KEY)
    else window.sessionStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage diblokir (mis. private mode): halaman review akan tampil kosong
  }
  listeners.forEach((notify) => notify())
}

export interface StoredImport {
  /** Berganti tiap upload baru; hasil edit di halaman review memakai id yang sama */
  id: string
  rows: ImportedTransaction[]
}

export function saveImportedTransactions(rows: readonly ImportedTransaction[], id: string = crypto.randomUUID()) {
  const payload: StoredImport = { id, rows: [...rows] }
  writeRaw(JSON.stringify(payload))
}

export function clearImportedTransactions() {
  writeRaw(null)
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => {
    listeners.delete(notify)
  }
}

function parseStoredImport(raw: string | null): StoredImport | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<StoredImport> | null
    if (typeof parsed?.id !== "string" || !Array.isArray(parsed.rows)) return null
    return { id: parsed.id, rows: parsed.rows }
  } catch {
    return null
  }
}

interface ImportedTransactionsSnapshot {
  stored: StoredImport | null
  /** false selama render di server / sebelum hydrate */
  isReady: boolean
}

// Snapshot server = undefined → bisa dibedakan dari "storage kosong" (null)
export function useImportedTransactions(): ImportedTransactionsSnapshot {
  const raw = React.useSyncExternalStore<string | null | undefined>(subscribe, readRaw, () => undefined)
  const stored = React.useMemo(() => parseStoredImport(raw ?? null), [raw])
  return { stored, isReady: raw !== undefined }
}
