import { API_BASE_URL, ApiError, apiRequest } from "@/lib/api/client";

export interface BlogProfileInput {
  displayName: string;
  photoProfile: string | null;
  description: string;
  socialMedia: Record<string, string>;
}

export async function updateBlogProfile(accessToken: string, input: BlogProfileInput): Promise<void> {
  await apiRequest("/api/blog/auth/me", "menyimpan profil", {
    method: "PATCH", accessToken, body: input,
  });
}

export async function uploadBlogProfilePhoto(accessToken: string, file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error("Pilih gambar JPG, PNG, WebP, atau GIF maksimal 5 MB.");
  }
  const body = new FormData();
  body.append("file", file);
  body.append("type", "CONTENT");
  const response = await fetch(`${API_BASE_URL}/api/blog/media`, {
    method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body,
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(json?.errors || "Gagal mengunggah foto profil.", response.status, null);
  const url = json?.data?.url;
  try {
    if (typeof url !== "string" || url.length > 2048 || new URL(url).protocol !== "https:") throw new Error();
  } catch {
    throw new Error("URL foto dari server tidak valid. Silakan unggah ulang.");
  }
  return url;
}
