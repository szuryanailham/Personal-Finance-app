"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InstallPromptEvent extends Event {
  prompt(): Promise<unknown>;
}

const usedPrompts = new WeakSet<InstallPromptEvent>();

export function InstallAppButton({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const installPrompt = useRef<InstallPromptEvent | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    function capturePrompt(event: Event) {
      if (!window.matchMedia("(width < 48rem)").matches) return;

      event.preventDefault();
      installPrompt.current = event as InstallPromptEvent;
    }

    function clearPrompt() {
      installPrompt.current = null;
    }

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", clearPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", clearPrompt);
    };
  }, []);

  async function handleInstall() {
    const prompt = installPrompt.current;
    if (prompt && !usedPrompts.has(prompt)) {
      usedPrompts.add(prompt);
      try {
        await prompt.prompt();
        return;
      } catch {
        // Fall back to the browser menu if the native prompt cannot open.
      }
    }

    setShowInstructions(true);
  }

  return (
    <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
      <button ref={button} type="button" className={className} onClick={handleInstall}>
        {children}
      </button>
      <DialogContent finalFocus={button}>
        <DialogHeader>
          <DialogTitle>Instal Artoku</DialogTitle>
          <DialogDescription>
            Pasang Artoku dari menu browser untuk membukanya dari layar utama.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          <li><strong>Chrome di Android</strong> — Buka menu ⋮ dan pilih <strong>Instal aplikasi</strong>.</li>
          <li><strong>Safari di iPhone</strong> — Ketuk <strong>Bagikan</strong>, lalu <strong>Tambahkan ke Layar Utama</strong>.</li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
