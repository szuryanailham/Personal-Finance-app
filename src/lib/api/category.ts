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
