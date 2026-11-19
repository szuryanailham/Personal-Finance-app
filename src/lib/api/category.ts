import type { CategoryAppearance } from "@/lib/category-appearance"
import type { DateRange } from "@/lib/date"

import { apiRequest } from "./client"

// Nilai mengikuti enum TransactionType di backend
export type CategoryType = "INCOME" | "EXPENSE" | "SAVING"

export interface Category extends CategoryAppearance {
  id: string
  name: string
  type: CategoryType
  totalExpense?: number
  remainingBudget?: number
}

export interface CategoryInput extends CategoryAppearance {
  name: string
  type: CategoryType
}

const CATEGORY_PATH = "/api/categories"

export const CATEGORY_FETCH_LIMIT = 100
const CATEGORY_PAGE_SIZE = 10

export async function fetchCategories(
  limit: number | null = CATEGORY_FETCH_LIMIT,
  signal?: AbortSignal
): Promise<Category[]> {
  const pageSize = limit ?? CATEGORY_PAGE_SIZE
  const categories: Category[] = []
  let totalPages = 1
  for (let page = 0; page < totalPages; page++) {
    const params = new URLSearchParams({ skip: String(page * pageSize), limit: String(pageSize) })
    const body = await apiRequest<Category[]>(CATEGORY_PATH, "memuat kategori", { params, signal })
    categories.push(...(body.data ?? []))
    totalPages = limit === null ? body.paging?.totalPage ?? 1 : 1
  }
  return categories.map(category => ({
    ...category,
    budget: category.budget ?? undefined,
    icon: category.icon ?? undefined,
    color: category.color && /^#[0-9a-f]{6}$/i.test(category.color) ? category.color : undefined,
    totalExpense: category.totalExpense ?? undefined,
    remainingBudget: category.remainingBudget ?? undefined,
  }))
}

export async function createCategory(input: CategoryInput): Promise<void> {
  await apiRequest(CATEGORY_PATH, "menambah kategori", { method: "POST", body: categoryPayload(input) })
}

export async function updateCategory(id: string, input: CategoryInput): Promise<void> {
  await apiRequest(`${CATEGORY_PATH}/${id}`, "mengubah kategori", { method: "PUT", body: categoryPayload(input) })
}

function categoryPayload({ name, type, budget, icon, color }: CategoryInput) {
  return { name, type, budget: type === "EXPENSE" ? budget : undefined, icon, color }
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
