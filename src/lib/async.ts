// Jeda minimum agar spinner tidak berkedip saat response backend sangat cepat
export const MIN_LOADING_MS = 600

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Jalankan `promise` dan tunggu minimal `ms`; hasil/error promise tetap diteruskan */
export async function withMinLoading<T>(promise: Promise<T>, ms: number = MIN_LOADING_MS): Promise<T> {
  const [result] = await Promise.all([promise, wait(ms)])
  return result
}
