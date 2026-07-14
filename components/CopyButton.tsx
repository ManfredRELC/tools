"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
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

  return (
    <button className={`copy-btn${copied ? " copied" : ""}`} onClick={handleCopy} type="button">
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
