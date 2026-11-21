"use client";

import { useEffect, useRef, useState } from "react";
import { LinkIcon } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const iconClassName = "inline-flex size-11 items-center justify-center rounded-full border border-slate-200 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]";

export function BlogShareActions({ title, url }: { title: string; url: string }) {
  const [message, setMessage] = useState("");
  const [showCopyField, setShowCopyField] = useState(false);
  const messageTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(messageTimeout.current), []);

  const encodedUrl = encodeURIComponent(url);
  const links = [
    { name: "WhatsApp", Icon: FaWhatsapp, color: "text-green-700", href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}` },
    { name: "Facebook", Icon: FaFacebook, color: "text-blue-700", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "X", Icon: FaXTwitter, color: "text-slate-900", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}` },
  ];

  async function copyLink(forInstagram = false) {
    try {
      await navigator.clipboard.writeText(url);
      clearTimeout(messageTimeout.current);
      setShowCopyField(false);
      setMessage(forInstagram ? "Tautan disalin. Tempel di DM atau stiker tautan Instagram." : "Tautan artikel disalin.");
      if (!forInstagram) {
        messageTimeout.current = setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      clearTimeout(messageTimeout.current);
      setShowCopyField(true);
      setMessage("Salin tautan artikel secara manual dari kolom di bawah.");
    }
  }

  return (
    <div className="mt-5">
      <div role="group" aria-label="Bagikan artikel" className="flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-sm font-medium text-slate-600">Bagikan</span>
        {links.map(({ name, Icon, color, href }) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Bagikan ke ${name} (tab baru)`} title={`Bagikan ke ${name}`} className={`${iconClassName} ${color}`}>
            <Icon aria-hidden="true" className="size-5" />
          </a>
        ))}
        <button type="button" onClick={() => void copyLink(true)} aria-label="Salin tautan untuk Instagram" title="Salin tautan untuk Instagram" className={`${iconClassName} text-pink-700`}>
          <FaInstagram aria-hidden="true" className="size-5" />
        </button>
        <button type="button" onClick={() => void copyLink()} aria-label="Salin tautan artikel" title="Salin tautan artikel" className={`${iconClassName} text-slate-700`}>
          <LinkIcon aria-hidden="true" className="size-5" />
        </button>
      </div>
      <p role="status" className={message ? "mt-2 text-sm text-slate-600" : "sr-only"}>{message}</p>
      {showCopyField && (
        <input aria-label="Tautan artikel" readOnly value={url} onFocus={event => event.target.select()} className="mt-2 w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm" />
      )}
    </div>
  );
}
