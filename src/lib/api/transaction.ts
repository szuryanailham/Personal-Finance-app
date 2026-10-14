import type { Transaction, TransactionType } from "@/components/table/TableComponent"
import { apiDownload, apiGet, apiRequest, type DownloadedFile, type Paging } from "./client"

export type { Paging }

interface TransactionResponse {
  transactionName: string
  transactionCode: string
  amount: number
  description: string
  category: {
    id: string
    name: string
    type: "INCOME" | "EXPENSE" | "SAVING"
  }
  date: string // format "YYYY-MM-DD"
}

export interface TransactionPage {
  transactions: Transaction[]
  paging: Paging | null
}

// Nilai `sort` yang diterima backend (lihat enum TransactionSort di API)
export type TransactionSortValue = "date" | "-date" | "amount" | "-amount" | "name" | "-name"

export const DEFAULT_TRANSACTION_SORT: TransactionSortValue = "date"

export type TransactionDatePreset = "all" | "today" | "last7" | "last14"

/** Preset disimpan apa adanya (bukan tanggal) agar "today" selalu dihitung ulang saat fetch */
export type TransactionDateFilter =
  | { preset: TransactionDatePreset }
  | { preset: "custom"; startDate: string; endDate: string } // format "YYYY-MM-DD"

/** Filter daftar transaksi; type "all" = tanpa filter tipe, categoryId null = semua kategori */
export interface TransactionListFilter {
  type: TransactionType | "all"
  categoryId: string | null
  dateRange: TransactionDateFilter
  sort: TransactionSortValue
}

export const DEFAULT_TRANSACTION_LIST_FILTER: TransactionListFilter = {
  type: "all",
  categoryId: null,
  dateRange: { preset: "all" },
  sort: DEFAULT_TRANSACTION_SORT,
}

// Nilai `period` di backend (enum TransactionDatePeriod); "today" dihitung di timezone server
const DATE_PERIOD: Record<TransactionDateFilter["preset"], string> = {
  all: "ALL",
  today: "TODAY",
  last7: "LAST_7_DAYS",
  last14: "LAST_14_DAYS",
  custom: "MANUAL",
}

// startDate/endDate hanya dibaca backend saat period=MANUAL; "all" tidak perlu dikirim
function setDateParams(params: URLSearchParams, filter: TransactionDateFilter): void {
  if (filter.preset === "all") return
  params.set("period", DATE_PERIOD[filter.preset])
  if (filter.preset === "custom") {
    params.set("startDate", filter.startDate)
    params.set("endDate", filter.endDate)
  }
}

/** Key stabil untuk filter tanggal, dipakai sebagai dependency fetch */
export function dateFilterKey(filter: TransactionDateFilter): string {
  return filter.preset === "custom" ? `custom:${filter.startDate}:${filter.endDate}` : filter.preset
}

interface FetchTransactionsParams {
  limit: number
  skip?: number
  search?: string
  /** Satu hari spesifik ("YYYY-MM-DD"); jika diisi, backend mengabaikan `dateRange` */
  date?: string
  dateRange?: TransactionDateFilter
  type?: TransactionType
  categoryId?: string
  sort?: TransactionSortValue
  signal?: AbortSignal
}

// "2026-09-22" di-parse sebagai tanggal lokal agar tidak bergeser karena timezone
function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function toTransaction(item: TransactionResponse): Transaction {
  return {
    transactionCode: item.transactionCode,
    date: parseLocalDate(item.date),
    description: item.transactionName,
    note: item.description ?? "",
    category: item.category.name,
    categoryId: item.category.id,
    type: item.category.type.toLowerCase() as TransactionType,
    amount: Number(item.amount),
  }
}

export async function fetchTransactions({
  limit,
  skip = 0,
  search,
  date,
  dateRange = DEFAULT_TRANSACTION_LIST_FILTER.dateRange,
  type,
  categoryId,
  sort = DEFAULT_TRANSACTION_SORT,
  signal,
}: FetchTransactionsParams): Promise<TransactionPage> {
  // Default "date" = tanggal terbaru dulu, supaya halaman pertama berisi transaksi terbaru
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip), sort })
  const keyword = search?.trim()
  if (keyword) params.set("search", keyword)
  if (date) params.set("date", date)
  else setDateParams(params, dateRange)
  // Backend memakai enum uppercase (INCOME/EXPENSE/SAVING)
  if (type) params.set("type", type.toUpperCase())
  if (categoryId) params.set("categoryId", categoryId)

  const body = await apiGet<TransactionResponse[]>("/api/transaction", params, "transaksi", signal)

  return {
    transactions: (body.data ?? []).map(toTransaction),
    paging: body.paging,
  }
}

export interface TransactionInput {
  transactionName: string
  amount: number
  description: string
  categoryId: string
  date: string // format "YYYY-MM-DD"
}

// Key `transactonName` (tanpa "i") mengikuti request body yang diharapkan backend
interface CreateTransactionRequest extends Omit<TransactionInput, "transactionName"> {
  transactonName: string
}

export async function createTransaction({
  transactionName,
  ...rest
}: TransactionInput): Promise<void> {
  const body: CreateTransactionRequest = { transactonName: transactionName, ...rest }
  await apiRequest("/api/transaction", "menambah transaksi", { method: "POST", body })
}

// PATCH bersifat parsial: field yang tidak dikirim tidak diubah oleh backend
export type TransactionPatch = Partial<TransactionInput>

/** Body PATCH /api/transaction/{transactionCode}; contoh: { transactonName: "...", amount: 20000 } */
export type UpdateTransactionRequest = Partial<CreateTransactionRequest>

// Field undefined dibuang agar hanya field yang diubah yang terkirim ke backend
function toUpdateTransactionRequest({ transactionName, ...rest }: TransactionPatch): UpdateTransactionRequest {
  const request: UpdateTransactionRequest = { transactonName: transactionName, ...rest }
  return Object.fromEntries(
    Object.entries(request).filter(([, value]) => value !== undefined)
  ) as UpdateTransactionRequest
}

export async function updateTransaction(transactionCode: string, patch: TransactionPatch): Promise<void> {
  const body = toUpdateTransactionRequest(patch)
  await apiRequest(`/api/transaction/${encodeURIComponent(transactionCode)}`, "mengubah transaksi", {
    method: "PATCH",
    body,
  })
}

// Mengembalikan `message` dari response backend untuk ditampilkan sebagai notifikasi
export async function deleteTransaction(transactionCode: string): Promise<string | null> {
  const body = await apiRequest(
    `/api/transaction/${encodeURIComponent(transactionCode)}`,
    "menghapus transaksi",
    { method: "DELETE" }
  )
  return body.message
}

// Satu request untuk banyak transaksi; backend menghapus semua kode di `transactionCodes`
export async function deleteTransactions(transactionCodes: readonly string[]): Promise<string | null> {
  const body = await apiRequest("/api/transaction/bulk", "menghapus transaksi", {
    method: "DELETE",
    body: { transactionCodes },
  })
  return body.message
}

export function downloadImportTemplate(): Promise<DownloadedFile> {
  return apiDownload("/api/transaction/import/template", "mengunduh template")
}

export type ExportPeriod = "all" | "yearly" | "monthly" | "weekly" | "custom"

export type ExportQuery =
  | { period: Exclude<ExportPeriod, "custom"> }
  | { period: "custom"; startDate: string; endDate: string } // format "YYYY-MM-DD"

// Backend menamai rentang tanggal bebas "manual", bukan "custom"
const EXPORT_MANUAL_PERIOD = "manual"

// "all" tidak mengirim `period` sehingga backend mengekspor semua transaksi
function toExportParams(query: ExportQuery): URLSearchParams {
  if (query.period === "all") return new URLSearchParams()
  if (query.period === "custom") {
    return new URLSearchParams({ period: EXPORT_MANUAL_PERIOD, startDate: query.startDate, endDate: query.endDate })
  }
  return new URLSearchParams({ period: query.period })
}

export function exportTransactions(query: ExportQuery): Promise<DownloadedFile> {
  return apiDownload("/api/transaction/export", "mengekspor transaksi", toExportParams(query))
}

export interface BulkResult {
  succeeded: number
  failed: number
  /** Pesan error pertama, untuk ditampilkan ke user */
  firstError: string | null
}

// Backend belum punya endpoint bulk, jadi tiap transaksi diproses paralel dan hasilnya dirangkum
export async function runBulk(
  codes: readonly string[],
  action: (transactionCode: string) => Promise<void>
): Promise<BulkResult> {
  const results = await Promise.allSettled(codes.map(action))
  const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected")
  const reason: unknown = rejected[0]?.reason
  return {
    succeeded: results.length - rejected.length,
    failed: rejected.length,
    firstError: rejected.length === 0 ? null : reason instanceof Error ? reason.message : "Terjadi kesalahan",
  }
}

export interface StatItem {
  amount: number
  changePercentage: number
}

export interface TransactionStat {
  totalBalance: StatItem
  totalIncome: StatItem
  totalExpense: StatItem
  totalSaving: StatItem
}

export type StatType = "yearly" | "monthly" | "weekly" | "custom"

// Tipe preset cukup kirim `type` (rentang dihitung backend); hanya "custom" yang wajib bawa tanggal
export type StatQuery =
  | { type: Exclude<StatType, "custom"> }
  | { type: "custom"; startDate: string; endDate: string } // format "YYYY-MM-DD"

type FetchTransactionStatParams = StatQuery & { signal?: AbortSignal }

function toStatParams(query: StatQuery): URLSearchParams {
  if (query.type === "custom") {
    return new URLSearchParams({ type: query.type, startDate: query.startDate, endDate: query.endDate })
  }
  return new URLSearchParams({ type: query.type })
}

const EMPTY_STAT_ITEM: StatItem = { amount: 0, changePercentage: 0 }

function toStatItem(item: StatItem | null | undefined): StatItem {
  if (!item) return EMPTY_STAT_ITEM
  return { amount: Number(item.amount), changePercentage: Number(item.changePercentage) }
}

export async function fetchTransactionStat({
  signal,
  ...query
}: FetchTransactionStatParams): Promise<TransactionStat> {
  const params = toStatParams(query)
  const body = await apiGet<TransactionStat>("/api/transaction/stat", params, "statistik", signal)

  return {
    totalBalance: toStatItem(body.data?.totalBalance),
    totalIncome: toStatItem(body.data?.totalIncome),
    totalExpense: toStatItem(body.data?.totalExpense),
    totalSaving: toStatItem(body.data?.totalSaving),
  }
}

export type StatisticPeriod = "Monthly" | "Weekly"

export interface StatisticItem {
  date: Date
  income: number
  expense: number
}

export interface TransactionStatistic {
  period: StatisticPeriod
  startDate: string // format "YYYY-MM-DD"
  endDate: string // format "YYYY-MM-DD"
  items: StatisticItem[]
}

interface TransactionStatisticResponse {
  period: StatisticPeriod
  startDate: string
  endDate: string
  items: { date: string; income: number; expense: number }[] | null
}

interface FetchTransactionStatisticParams {
  period: StatisticPeriod
  signal?: AbortSignal
}

export async function fetchTransactionStatistic({
  period,
  signal,
}: FetchTransactionStatisticParams): Promise<TransactionStatistic> {
  const params = new URLSearchParams({ periode: period })
  const body = await apiGet<TransactionStatisticResponse>(
    "/api/transaction/statistic",
    params,
    "statistik chart",
    signal
  )

  return {
    period: body.data?.period ?? period,
    startDate: body.data?.startDate ?? "",
    endDate: body.data?.endDate ?? "",
    items: (body.data?.items ?? []).map((item) => ({
      date: parseLocalDate(item.date),
      income: Number(item.income),
      expense: Number(item.expense),
    })),
  }
}
