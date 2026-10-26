import { apiRequest } from "./client"

const FINANCIAL_SETUP_PATH = "/api/financial-setup"

export interface FinancialSetupRequest {
  /** Saldo awal rekening utama (MAIN) */
  balance: number
  /** Saldo awal tabungan (SAVINGS) */
  savings: number
}

export interface FinancialSetupAccount {
  id: string
  accountType: "MAIN" | "SAVINGS"
  name: string
  openingBalance: number
  currentBalance: number
}

export interface FinancialSetupResponse {
  setupCompleted: boolean
  accounts: FinancialSetupAccount[]
  totalBalance: number
}

function requireData(data: FinancialSetupResponse | null, label: string): FinancialSetupResponse {
  if (!data) throw new Error(`Response ${label} tidak valid`)
  return data
}

export async function fetchFinancialSetup(signal?: AbortSignal): Promise<FinancialSetupResponse> {
  const res = await apiRequest<FinancialSetupResponse>(FINANCIAL_SETUP_PATH, "memuat setup awal", { signal })
  return requireData(res.data, "setup awal")
}

// Hanya bisa sekali per user; backend mengembalikan 409 bila setup sudah selesai / dilewati
export async function completeFinancialSetup(request: FinancialSetupRequest): Promise<FinancialSetupResponse> {
  const res = await apiRequest<FinancialSetupResponse>(FINANCIAL_SETUP_PATH, "menyimpan setup awal", {
    method: "PUT",
    body: request,
  })
  return requireData(res.data, "setup awal")
}

export async function skipFinancialSetup(): Promise<FinancialSetupResponse> {
  const res = await apiRequest<FinancialSetupResponse>(`${FINANCIAL_SETUP_PATH}/skip`, "melewati setup awal", {
    method: "POST",
  })
  return requireData(res.data, "lewati setup awal")
}
