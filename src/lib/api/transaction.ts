import type { Transaction, TransactionType } from "@/components/table/TableComponent"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

// Bentuk response dari backend Spring Boot
interface ApiResponse<T> {
  data: T | null
  message: string | null
  errors: string | null
  paging: Paging | null
}

export interface Paging {
  currentPage: number
  totalPage: number
  size: number
}

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

interface FetchTransactionsParams {
  limit: number
  skip?: number
  search?: string
  date?: string // format "YYYY-MM-DD"
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
    category: item.category.name,
    type: item.category.type.toLowerCase() as TransactionType,
    amount: Number(item.amount),
  }
}

async function apiGet<T>(
  path: string,
  params: URLSearchParams,
  errorLabel: string,
  signal?: AbortSignal
): Promise<ApiResponse<T>> {
  if (!API_TOKEN) {
    throw new Error("NEXT_PUBLIC_API_TOKEN belum diset di .env.local")
  }

  const res = await fetch(`${API_BASE_URL}${path}?${params}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    signal,
  })

  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null

  if (!res.ok || !body) {
    throw new Error(body?.errors ?? `Gagal memuat ${errorLabel} (HTTP ${res.status})`)
  }

  return body
}

export async function fetchTransactions({
  limit,
  skip = 0,
  search,
  date,
  signal,
}: FetchTransactionsParams): Promise<TransactionPage> {
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
  const keyword = search?.trim()
  if (keyword) params.set("search", keyword)
  if (date) params.set("date", date)

  const body = await apiGet<TransactionResponse[]>("/api/transaction", params, "transaksi", signal)

  return {
    transactions: (body.data ?? []).map(toTransaction),
    paging: body.paging,
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

interface FetchTransactionStatParams {
  startDate: string // format "YYYY-MM-DD"
  endDate: string // format "YYYY-MM-DD"
  signal?: AbortSignal
}

const EMPTY_STAT_ITEM: StatItem = { amount: 0, changePercentage: 0 }

function toStatItem(item: StatItem | null | undefined): StatItem {
  if (!item) return EMPTY_STAT_ITEM
  return { amount: Number(item.amount), changePercentage: Number(item.changePercentage) }
}

export async function fetchTransactionStat({
  startDate,
  endDate,
  signal,
}: FetchTransactionStatParams): Promise<TransactionStat> {
  const params = new URLSearchParams({ startDate, endDate })
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
