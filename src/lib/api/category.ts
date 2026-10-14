import type { DateRange } from "@/lib/date"

import { apiRequest } from "./client"

// Nilai mengikuti enum TransactionType di backend
export type CategoryType = "INCOME" | "EXPENSE" | "SAVING"

export interface Category {
  id: string
  name: string
  type: CategoryType
}

export interface CategoryInput {
  name: string
  type: CategoryType
}

const CATEGORY_PATH = "/api/categories"

// Jumlah kategori per user relatif kecil, jadi cukup ambil sekaligus tanpa paginasi
export const CATEGORY_FETCH_LIMIT = 100

export async function fetchCategories(
  limit: number = CATEGORY_FETCH_LIMIT,
  signal?: AbortSignal
): Promise<Category[]> {
  const params = new URLSearchParams({ skip: "0", limit: String(limit) })
  const body = await apiRequest<Category[]>(CATEGORY_PATH, "memuat kategori", { params, signal })
  return body.data ?? []
}

export async function createCategory(input: CategoryInput): Promise<void> {
  await apiRequest(CATEGORY_PATH, "menambah kategori", { method: "POST", body: input })
}

export async function updateCategory(id: string, input: CategoryInput): Promise<void> {
  await apiRequest(`${CATEGORY_PATH}/${id}`, "mengubah kategori", { method: "PUT", body: input })
}

export async function deleteCategory(id: string): Promise<void> {
  await apiRequest(`${CATEGORY_PATH}/${id}`, "menghapus kategori", { method: "DELETE" })
}

export interface CategoryStatisticItem {
  categoryId: string
  categoryName: string
  percentage: number
  totalAmount: number
  transactionCount: number
}

export interface CategoryStatistic {
  period: DateRange
  totalExpense: number
  categories: CategoryStatisticItem[]
}

export type CategoryStatPeriod = "today" | "weekly" | "monthly" | "yearly" | "custom"

/** Nilai `period` mengikuti enum CategoryStatPeriod di backend (case-insensitive) */
export type CategoryStatisticQuery =
  | { period: Exclude<CategoryStatPeriod, "custom"> }
  | { period: "custom"; startDate: string; endDate: string } // format "YYYY-MM-DD"

// Sama dengan default backend, supaya tampilan awal tidak berubah
export const DEFAULT_CATEGORY_STATISTIC_QUERY: CategoryStatisticQuery = { period: "monthly" }

function toStatisticParams(query: CategoryStatisticQuery): URLSearchParams {
  if (query.period === "custom") {
    return new URLSearchParams({ period: query.period, startDate: query.startDate, endDate: query.endDate })
  }
  return new URLSearchParams({ period: query.period })
}

/** Key stabil untuk query statistik, dipakai sebagai dependency fetch */
export function categoryStatisticQueryKey(query: CategoryStatisticQuery): string {
  return query.period === "custom" ? `custom:${query.startDate}:${query.endDate}` : query.period
}

// Statistik pengeluaran per kategori pada periode yang dipilih
export async function fetchCategoryStatistic(
  query: CategoryStatisticQuery,
  signal?: AbortSignal
): Promise<CategoryStatistic> {
  const body = await apiRequest<CategoryStatistic>(`${CATEGORY_PATH}/statistic`, "memuat statistik kategori", {
    params: toStatisticParams(query),
    signal,
  })
  if (!body.data) throw new Error("Data statistik kategori kosong")
  return body.data
}
