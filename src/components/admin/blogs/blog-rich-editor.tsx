"use client";

import { useEffect, useRef, useState } from "react";
import type Quill from "quill";
import "quill/dist/quill.snow.css";
import styles from "./blog-rich-editor.module.css";

export type BlogEditorContent = { html: string; text: string };

type Props = {
  initialHtml?: string;
  disabled: boolean;
  onChange: (content: BlogEditorContent) => void;
  onImageUpload: (file: File) => Promise<string>;
  onBusyChange: (uploading: boolean) => void;
};

export function BlogRichEditor({ initialHtml = "", disabled, onChange, onImageUpload, onBusyChange }: Props) {
  const initialHtmlRef = useRef(initialHtml);
  const host = useRef<HTMLDivElement>(null);
  const instance = useRef<Quill | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const markdownInput = useRef<HTMLInputElement>(null);
  const importingRef = useRef(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const insertionIndex = useRef(0);
  const uploadingRef = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const disabledRef = useRef(disabled);
  const onChangeRef = useRef(onChange);
  const [loadError, setLoadError] = useState(false);
  const [ready, setReady] = useState(false);
  const selectedImage = useRef<HTMLImageElement | null>(null);
  const [hasSelectedImage, setHasSelectedImage] = useState(false);
  const [imageWidth, setImageWidth] = useState("");

  useEffect(() => {
    disabledRef.current = disabled;
    instance.current?.enable(!disabled && !uploading);
  }, [disabled, uploading]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    const container = host.current;
    let quill: Quill | null = null;
    let overlay: HTMLDivElement | null = null;
    let stopResize: (() => void) | null = null;
    const clearOverlay = () => {
      stopResize?.();
      overlay?.remove();
      overlay = null;
    };
    const positionOverlay = () => {
      const image = selectedImage.current;
      if (!overlay || !image || !container) return;
      if (!image.isConnected) { clearOverlay(); return; }
      const bounds = image.getBoundingClientRect();
      const parent = container.getBoundingClientRect();
      Object.assign(overlay.style, { left: `${bounds.left - parent.left}px`, top: `${bounds.top - parent.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px` });
    };
    const observer = new ResizeObserver(positionOverlay);
    if (container) observer.observe(container);
    window.addEventListener("scroll", positionOverlay, true);
    const handleClick = (event: MouseEvent) => {
      clearOverlay();
      selectedImage.current = event.target instanceof HTMLImageElement ? event.target : null;
      setHasSelectedImage(Boolean(selectedImage.current));
      setImageWidth(selectedImage.current?.getAttribute("width") ?? "");
      const image = selectedImage.current;
      if (!image || !container || disabledRef.current || uploadingRef.current) return;
      observer.disconnect();
      observer.observe(container);
      observer.observe(image);
      overlay = document.createElement("div");
      overlay.className = styles.imageSelection;
      container.append(overlay);
      for (const corner of ["topLeft", "topRight", "bottomLeft", "bottomRight"]) {
        const handle = document.createElement("button");
        handle.type = "button";
        handle.className = `${styles.resizeHandle} ${styles[corner]}`;
        handle.setAttribute("aria-label", "Tarik untuk mengubah ukuran gambar");
        handle.title = "Tarik untuk mengubah ukuran gambar";
        handle.addEventListener("pointerdown", event => {
          if (event.button !== 0 || disabledRef.current || uploadingRef.current || !quill) return;
          event.preventDefault();
          event.stopPropagation();
          handle.setPointerCapture(event.pointerId);
          const startX = event.clientX;
          const startWidth = image.getBoundingClientRect().width;
          const originalWidth = image.style.width;
          let width = startWidth;
          const move = (moveEvent: PointerEvent) => {
            if (moveEvent.pointerId !== event.pointerId || !quill || disabledRef.current || uploadingRef.current) return;
            const style = getComputedStyle(quill.root);
            const maxWidth = Math.min(4096, quill.root.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
            width = Math.max(1, Math.min(maxWidth, Math.round(startWidth + (moveEvent.clientX - startX) * (corner.endsWith("Left") ? -1 : 1))));
            image.style.width = `${width}px`;
            positionOverlay();
          };
          const finish = (finishEvent: PointerEvent) => {
            if (finishEvent.pointerId !== event.pointerId) return;
            cleanup();
            if (finishEvent.type !== "pointerup" || !quill || disabledRef.current || uploadingRef.current || !quill.root.contains(image)) return;
            const QuillClass = quill.constructor as typeof import("quill").default;
            const blot = QuillClass.find(image);
            if (!blot || !("statics" in blot) || blot.statics.blotName !== "image") return;
            quill.history.cutoff();
            quill.formatText(quill.getIndex(blot as Parameters<Quill["getIndex"]>[0]), 1, { width: String(width), height: false }, "user");
            quill.history.cutoff();
            positionOverlay();
          };
          const cleanup = () => {
            image.style.width = originalWidth;
            handle.removeEventListener("pointermove", move);
            handle.removeEventListener("pointerup", finish);
            handle.removeEventListener("lostpointercapture", finish);
            if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
            stopResize = null;
            positionOverlay();
          };
          stopResize = cleanup;
          handle.addEventListener("pointermove", move);
          handle.addEventListener("pointerup", finish);
          handle.addEventListener("lostpointercapture", finish);
        });
        overlay.append(handle);
      }
      positionOverlay();
    };
    const update = () => {
      if (selectedImage.current && !quill?.root.contains(selectedImage.current)) {
        selectedImage.current = null;
        setHasSelectedImage(false);
      } else if (selectedImage.current) {
        setImageWidth(selectedImage.current.getAttribute("width") ?? "");
      }
      positionOverlay();
      if (quill) onChangeRef.current({ html: quill.getSemanticHTML(), text: quill.getText() });
    };
    async function initialize() {
      try {
        const { default: Quill } = await import("quill");
        if (cancelled || !container) return;
        const element = document.createElement("div");
        container.append(element);
        quill = new Quill(element, {
          theme: "snow",
          placeholder: "Mulai menulis artikel di sini…",
          readOnly: disabledRef.current,
          formats: ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "link", "image", "table", "code", "code-block"],
          modules: {
            table: true,
            toolbar: { container: [
              [{ header: [2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              ["blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "clean"],
            ], handlers: {
              image: () => {
                if (!quill || disabledRef.current || uploadingRef.current || importingRef.current) return;
                insertionIndex.current = quill.getSelection(true)?.index ?? Math.max(0, quill.getLength() - 1);
                fileInput.current?.click();
              },
            } },
            history: { delay: 1000, maxStack: 100, userOnly: true },
          },
        });
        // Quill exports empty cells without a break, so restore their newline on load.
        quill.clipboard.addMatcher("td", (_node, delta) => delta.length() ? delta : delta.insert("\n"));
        instance.current = quill;
        quill.root.addEventListener("click", handleClick);
        quill.root.setAttribute("role", "textbox");
        quill.root.setAttribute("aria-labelledby", "content-label");
        quill.root.setAttribute("aria-required", "true");
        quill.root.setAttribute("aria-multiline", "true");
        const labels: Record<string, string> = {
          bold: "Tebal", italic: "Miring", underline: "Garis bawah", strike: "Coret",
          image: "Upload gambar artikel", blockquote: "Kutipan", link: "Tautan", clean: "Hapus format",
        };
        container.querySelectorAll<HTMLButtonElement>(".ql-toolbar button").forEach(button => {
          button.type = "button";
          const format = [...button.classList].find(name => name.startsWith("ql-"))?.slice(3) ?? "";
          const label = format === "list" ? (button.value === "ordered" ? "Daftar angka" : "Daftar poin") : labels[format] ?? format;
          button.setAttribute("aria-label", label);
          button.title = label;
        });
        container.querySelector(".ql-picker-label")?.setAttribute("aria-label", "Gaya paragraf");
        if (initialHtmlRef.current) quill.clipboard.dangerouslyPasteHTML(initialHtmlRef.current);
        update();
        quill.on("text-change", update);
        setReady(true);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }
    void initialize();
    return () => {
      cancelled = true;
      clearOverlay();
      observer.disconnect();
      window.removeEventListener("scroll", positionOverlay, true);
      quill?.off("text-change", update);
      quill?.root.removeEventListener("click", handleClick);
      selectedImage.current = null;
      quill?.disable();
      instance.current = null;
      container?.replaceChildren();
    };
  }, []);

  function resizeImage(width: string) {
    const quill = instance.current;
    const image = selectedImage.current;
    if (!quill || !image || !quill.root.contains(image) || disabled || uploading) return;
    if (width && (!Number.isInteger(Number(width)) || Number(width) < 1 || Number(width) > 4096)) return;
    const QuillClass = quill.constructor as typeof import("quill").default;
    const blot = QuillClass.find(image);
    if (!blot || !("statics" in blot) || blot.statics.blotName !== "image") return;
    const index = quill.getIndex(blot as Parameters<Quill["getIndex"]>[0]);
    quill.history.cutoff();
    quill.formatText(index, 1, { width: width || false, height: false }, "user");
    quill.history.cutoff();
    setImageWidth(width);
  }

  async function uploadImage(file: File) {
    const quill = instance.current;
    if (!quill || uploadingRef.current || importingRef.current || disabled) return;
    setUploadError("");
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setUploadError("Pilih JPG, PNG, WebP, atau GIF maksimal 5 MB."); return;
    }
    uploadingRef.current = true;
    quill.disable();
    setUploading(true);
    onBusyChange(true);
    try {
      const url = await onImageUpload(file);
      if (instance.current !== quill) return;
      const index = Math.min(insertionIndex.current, Math.max(0, quill.getLength() - 1));
      quill.enable();
      quill.insertEmbed(index, "image", url, "user");
      quill.setSelection(index + 1, 0, "silent");
      onChangeRef.current({ html: quill.getSemanticHTML(), text: quill.getText() });
    } catch (error) {
      if (instance.current === quill) setUploadError(error instanceof Error ? error.message : "Upload gambar gagal. Silakan coba lagi.");
    } finally {
      uploadingRef.current = false;
      onBusyChange(false);
      if (instance.current === quill) {
        setUploading(false);
        quill.enable(!disabledRef.current);
      }
    }
  }

  async function importMarkdown(file: File) {
    const quill = instance.current;
    if (!quill || uploadingRef.current || importingRef.current || disabledRef.current) return;
    setImportError("");
    if (!/\.(md|markdown)$/i.test(file.name) || file.size > 1_000_000) {
      setImportError("Pilih file .md atau .markdown maksimal 1 MB.");
      return;
    }

    importingRef.current = true;
    setImporting(true);
    onBusyChange(true);
    try {
      const [{ Marked }, markdown] = await Promise.all([import("marked"), file.text()]);
      if (instance.current !== quill || disabledRef.current) return;

      const parser = new Marked({
        gfm: true,
        renderer: {
          html: () => "",
          tablecell({ header, tokens }) {
            const text = this.parser.parseInline(tokens);
            // Quill uses TD for every editable cell and needs a break for empty cells.
            return `<td>${text ? (header ? `<strong>${text}</strong>` : text) : "<br>"}</td>`;
          },
          table({ header, rows }) {
            // Whitespace between rows is interpreted by Quill as a separate paragraph.
            const body = [header, ...rows].map(row =>
              `<tr>${row.map(cell => this.tablecell(cell)).join("")}</tr>`,
            ).join("");
            return `<table><tbody>${body}</tbody></table><p><br></p>`;
          },
        },
      });
      const html = parser.parse(markdown, { async: false });
      const contents = quill.clipboard.convert({ html });
      if (!contents.length()) {
        setImportError("File Markdown tidak berisi konten yang bisa diimpor.");
        return;
      }

      const end = quill.getLength();
      const insertion = quill.getContents(0, 0).retain(end === 1 ? 0 : end);
      // Keep separately imported tables from merging when they touch.
      if (quill.getContents(end - 1, 1).ops[0]?.attributes?.table) insertion.insert("\n");
      quill.history.cutoff();
      quill.updateContents(insertion.concat(contents), "user");
      quill.history.cutoff();
      quill.setSelection(quill.getLength() - 1, 0, "silent");
    } catch {
      if (instance.current === quill) setImportError("File Markdown gagal diimpor. Silakan coba lagi.");
    } finally {
      importingRef.current = false;
      if (instance.current === quill) {
        setImporting(false);
        onBusyChange(false);
      }
    }
  }

  return <div className={styles.editor} aria-busy={uploading || importing || (!ready && !loadError)}>
    {!ready && !loadError && <p role="status" className="p-3 text-sm text-[#646970]">Memuat editor…</p>}
    {loadError && <p role="alert" className="p-3 text-sm text-red-700">Editor gagal dimuat. Muat ulang halaman untuk mencoba lagi.</p>}
    {ready && <div className="flex flex-wrap items-center gap-2 p-3 text-sm">
      <button type="button" disabled={disabled || uploading || importing} onClick={() => markdownInput.current?.click()} className="rounded border border-[#8c8f94] px-3 py-1.5 font-medium hover:bg-[#f6f7f7] disabled:opacity-60">
        Impor Markdown
      </button>
      <span className="text-xs text-[#646970]">Isi file ditambahkan di akhir artikel.</span>
      <input ref={markdownInput} type="file" accept=".md,.markdown" hidden aria-label="Pilih file Markdown" onChange={event => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) void importMarkdown(file);
      }} />
    </div>}
    {importing && <p role="status" className="px-3 pb-2 text-sm text-[#2271b1]">Mengimpor Markdown…</p>}
    {importError && <p role="alert" className="px-3 pb-2 text-sm text-red-700">{importError}</p>}
    <div ref={host} className={styles.editorHost} />
    {hasSelectedImage && <fieldset disabled={disabled || uploading} className={styles.imageControls}>
      <legend>Ukuran gambar terpilih</legend>
      <label>Lebar (px)
        <input type="number" min={1} max={4096} step={1} value={imageWidth} placeholder="Otomatis" onChange={event => {
          setImageWidth(event.target.value);
          resizeImage(event.target.value);
        }} onBlur={() => setImageWidth(selectedImage.current?.getAttribute("width") ?? "")} />
      </label>
      {[["320", "Kecil"], ["640", "Sedang"], ["960", "Besar"], ["", "Otomatis"]].map(([width, label]) =>
        <button key={label} type="button" aria-pressed={imageWidth === width} onClick={() => resizeImage(width)}>{label}</button>
      )}
      <p>Proporsi gambar tetap terjaga. Lebar menyesuaikan ruang yang tersedia jika layar lebih kecil.</p>
    </fieldset>}
    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden aria-label="Pilih gambar artikel" onChange={event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (file) void uploadImage(file);
    }} />
    {uploading && <p role="status" className="p-3 text-sm text-[#2271b1]">Mengunggah gambar ke ImageKit…</p>}
    {uploadError && <p role="alert" className="p-3 text-sm text-red-700">{uploadError}</p>}
    <p className="p-3 text-xs text-[#646970]">Gunakan ikon gambar untuk menyisipkan JPG, PNG, WebP, atau GIF (maksimal 5 MB). Klik gambar, lalu tarik pegangan di sudutnya untuk mengubah ukuran.</p>
  </div>;
}
