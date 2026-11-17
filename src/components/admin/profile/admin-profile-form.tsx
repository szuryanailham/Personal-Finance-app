"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa";
import { useAdminSession } from "@/components/admin/blogs/blog-auth";
import { adminLogout } from "@/app/admin/actions";
import { ApiError } from "@/lib/api/client";
import { updateBlogProfile, uploadBlogProfilePhoto } from "@/lib/api/admin/blog-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const socialPlatforms = [
  { name: "instagram", label: "Instagram", icon: FaInstagram, placeholder: "https://www.instagram.com/username" },
  { name: "tiktok", label: "TikTok", icon: FaTiktok, placeholder: "https://www.tiktok.com/@username" },
  { name: "linkedin", label: "LinkedIn", icon: FaLinkedin, placeholder: "https://www.linkedin.com/in/username" },
] as const;

export function AdminProfileForm() {
  const { user, token } = useAdminSession();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [photoProfile, setPhotoProfile] = useState(user.photoProfile ?? "");
  const [description, setDescription] = useState(user.description ?? "");
  const [socials, setSocials] = useState<Record<string, string>>(() => ({ ...user.socialMedia }));
  const [uploading, setUploading] = useState(false);
  const uploadingRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const submitting = useRef(false);

  async function uploadPhoto(file: File) {
    if (uploadingRef.current || submitting.current) return;
    uploadingRef.current = true;
    setUploading(true); setError(""); setSuccess("");
    try {
      const url = await uploadBlogProfilePhoto(token, file);
      setPhotoProfile(url);
      setSuccess("Foto berhasil diunggah. Klik Simpan perubahan untuk memperbarui profil.");
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setError("Sesi CMS berakhir. Silakan masuk kembali.");
        await adminLogout();
        window.location.replace("/admin/login");
      } else setError(cause instanceof Error ? cause.message : "Gagal mengunggah foto profil.");
    } finally { uploadingRef.current = false; setUploading(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || uploadingRef.current) return;
    setError(""); setSuccess("");
    if (!displayName.trim()) { setError("Nama tampilan wajib diisi."); return; }
    const urls = [photoProfile, ...Object.values(socials)].filter(value => value.trim());
    if (urls.some(value => { try { return value.trim().length > 2048 || new URL(value.trim()).protocol !== "https:"; } catch { return true; } })) {
      setError("Gunakan URL HTTPS lengkap dengan panjang maksimal 2048 karakter."); return;
    }
    submitting.current = true; setBusy(true);
    try {
      await updateBlogProfile(token, {
        displayName: displayName.trim(), photoProfile: photoProfile.trim() || null, description: description.trim(),
        socialMedia: Object.fromEntries(Object.entries(socials).filter(([, url]) => url.trim()).map(([name, url]) => [name, url.trim()])),
      });
      setSuccess("Profil berhasil diperbarui.");
      router.refresh();
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setError("Sesi CMS berakhir. Silakan masuk kembali.");
        await adminLogout();
        window.location.replace("/admin/login");
      } else setError(cause instanceof Error ? cause.message : "Gagal menyimpan profil. Silakan coba lagi.");
    } finally { submitting.current = false; setBusy(false); }
  }

  return <form onSubmit={save} className="mt-6 space-y-6 rounded-lg border border-[#c3c4c7] bg-white p-5 sm:p-6">
    <div className="border-b pb-4 text-sm">
      <p className="break-all font-medium">{user.email}</p>
      <p className="mt-1 text-[#646970]">{user.roles.join(", ")}</p>
    </div>
    <fieldset disabled={busy || uploading} className="min-w-0 space-y-5 disabled:opacity-70">
      <legend className="sr-only">Informasi profil</legend>
      <div className="space-y-2"><Label htmlFor="displayName">Nama tampilan</Label><Input id="displayName" autoComplete="name" required value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
      <div className="space-y-3" aria-busy={uploading}>
        <Label htmlFor="profile-photo-upload">Foto profil</Label>
        {photoProfile.startsWith("https://") && (
          // URL berasal dari upload atau input pengguna; gambar tidak melalui optimasi Next.js.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoProfile} alt="Pratinjau foto profil" className="size-24 rounded-full border border-[#c3c4c7] object-cover" />
        )}
        <Input id="profile-photo-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void uploadPhoto(file);
        }} aria-describedby="profile-photo-help" />
        <p id="profile-photo-help" className="text-xs text-[#646970]">JPG, PNG, WebP, atau GIF, maksimal 5 MB. Simpan perubahan setelah foto selesai diunggah.</p>
        {photoProfile && <Button type="button" variant="outline" onClick={() => { setPhotoProfile(""); setSuccess(""); }}>Hapus foto</Button>}
      </div>
      <div className="space-y-2"><Label htmlFor="description">Bio penulis</Label><Textarea id="description" rows={4} placeholder="Ceritakan sedikit tentang Anda" value={description} onChange={e => setDescription(e.target.value)} /></div>
      <section className="space-y-3" aria-labelledby="social-heading">
        <h2 id="social-heading" className="text-sm font-medium">Media sosial</h2>
        <p className="text-xs text-[#646970]">Tambahkan tautan profil Anda. Kosongkan jika tidak digunakan.</p>
        {socialPlatforms.map(platform => <div key={platform.name} className="space-y-2">
          <Label htmlFor={`social-${platform.name}`}>{platform.label}</Label>
          <div className="relative">
            <platform.icon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black" />
            <Input
            className="h-10 pl-10"
            id={`social-${platform.name}`}
            type="url"
            maxLength={2048}
            placeholder={platform.placeholder}
            value={socials[platform.name] ?? ""}
            onChange={event => setSocials(items => ({ ...items, [platform.name]: event.target.value }))}
            />
          </div>
        </div>)}
      </section>
    </fieldset>
    {uploading && <p role="status" className="text-sm text-[#2271b1]">Mengunggah foto profil…</p>}
    {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {success && <p role="status" className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{success}</p>}
    <Button type="submit" disabled={busy || uploading} className="bg-[#2271b1] text-white hover:bg-[#135e96]">{busy ? "Menyimpan…" : "Simpan perubahan"}</Button>
  </form>;
}
