"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, apiRequest } from "@/lib/api/client";

const SUBJECTS = [
  "Pertanyaan seputar Artoku",
  "Kendala penggunaan",
  "Masukan dan saran",
  "Kerja sama",
  "Lainnya",
] as const;

type ContactValues = { name: string; email: string; subject: string; message: string };
const CONTROL_CLASS = "h-12 border-slate-300 bg-white px-3 text-slate-950 hover:border-[#14864A]/60 focus-visible:border-[#14864A] focus-visible:ring-[#14864A]/20";
const UNAVAILABLE_MESSAGE = "Pengiriman pesan belum tersedia saat ini. Pesan kamu belum terkirim. Silakan coba lagi nanti.";

export function ContactForm({ endpoint }: { endpoint: string | null }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactValues>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });
  const submissionLock = useRef(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function submit(values: ContactValues) {
    if (submissionLock.current) return;
    submissionLock.current = true;
    setFeedback(null);
    try {
      if (!endpoint) {
        setFeedback({ type: "error", message: UNAVAILABLE_MESSAGE });
        return;
      }
      const response = await apiRequest<unknown>(endpoint, "mengirim pesan", {
        method: "POST",
        isPublic: true,
        body: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])),
        signal: AbortSignal.timeout(30_000),
      });
      if (response.errors) throw new Error(response.errors);
      reset();
      setFeedback({ type: "success", message: "Pesan kamu berhasil dikirim. Terima kasih sudah menghubungi Artoku!" });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof ApiError ? error.message : "Pesan belum berhasil dikirim. Silakan coba lagi.",
      });
    } finally {
      submissionLock.current = false;
    }
  }

  return (
    <form noValidate onSubmit={(event) => handleSubmit(submit)(event)} aria-busy={isSubmitting} className="mt-8">
      {!endpoint && <p className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">Pengiriman pesan belum tersedia saat ini. Silakan coba lagi nanti.</p>}
      <fieldset disabled={isSubmitting} className="flex min-w-0 flex-col gap-5">
        <legend className="sr-only">Formulir kontak</legend>
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nama <span aria-hidden="true" className="text-[#14864A]">*</span></Label>
          <Input id="contact-name" type="text" autoComplete="name" placeholder="Masukkan nama kamu" required maxLength={100} className={CONTROL_CLASS}
            aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name", { validate: value => Boolean(value.trim()) || "Nama wajib diisi." })} />
          {errors.name && <p id="contact-name-error" role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email <span aria-hidden="true" className="text-[#14864A]">*</span></Label>
          <Input id="contact-email" type="email" autoComplete="email" placeholder="nama@email.com" required maxLength={254} className={CONTROL_CLASS}
            aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email", { validate: value => !value.trim() ? "Email wajib diisi." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Masukkan alamat email yang valid." })} />
          {errors.email && <p id="contact-email-error" role="alert" className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subjek <span aria-hidden="true" className="text-[#14864A]">*</span></Label>
          <select id="contact-subject" required className={`${CONTROL_CLASS} w-full min-w-0 rounded-lg border text-base outline-none transition-colors focus-visible:ring-3 disabled:opacity-50 aria-invalid:border-destructive md:text-sm`}
            aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            {...register("subject", { validate: value => SUBJECTS.some(subject => subject === value) || "Pilih subjek pesan." })}>
            <option value="" disabled>Pilih subjek pesan</option>
            {SUBJECTS.map(subject => <option key={subject} value={subject}>{subject}</option>)}
          </select>
          {errors.subject && <p id="contact-subject-error" role="alert" className="text-sm text-destructive">{errors.subject.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message">Pesan <span aria-hidden="true" className="text-[#14864A]">*</span></Label>
          <Textarea id="contact-message" placeholder="Tuliskan pesan atau pertanyaan kamu..." required rows={5} maxLength={5000}
            className="min-h-36 resize-y border-slate-300 bg-white px-3 py-3 text-slate-950 focus-visible:border-[#14864A] focus-visible:ring-[#14864A]/20"
            aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined}
            {...register("message", { validate: value => Boolean(value.trim()) || "Pesan wajib diisi." })} />
          {errors.message && <p id="contact-message-error" role="alert" className="text-sm text-destructive">{errors.message.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="h-12 w-full gap-2 bg-[#14864A] text-white hover:bg-[#10733e] focus-visible:ring-[#14864A]/30">
          {isSubmitting ? <Spinner /> : <Send aria-hidden="true" />}
          {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
        </Button>
      </fieldset>
      <div aria-live="polite" aria-atomic="true" className="mt-4">
        {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`rounded-lg border p-4 text-sm leading-6 ${feedback.type === "success" ? "border-green-200 bg-[#F7FBF8] text-[#10733e]" : "border-red-200 bg-red-50 text-red-800"}`}>{feedback.message}</p>}
      </div>
    </form>
  );
}
