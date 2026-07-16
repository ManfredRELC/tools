"use client";

import { useState } from "react";

export function CopyButton({ text, variant = "light" }: { text: string; variant?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard access denied; nothing to recover client-side
    }
  }

  const base = variant === "dark" ? "script-copy-btn" : "copy-btn";

  return (
    <button className={`${base}${copied ? " copied" : ""}`} onClick={handleCopy} type="button">
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
