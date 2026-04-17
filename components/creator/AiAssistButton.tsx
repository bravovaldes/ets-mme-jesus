"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AiAssistButtonProps {
  type: "biographie" | "annonce" | "epitaphe" | "programme" | "invitation";
  context: Record<string, string>;
  onResult: (text: string) => void;
  label?: string;
}

export default function AiAssistButton({
  type,
  context,
  onResult,
  label = "Aider a rediger",
}: AiAssistButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      });
      const data = await res.json();
      if (data.text) {
        onResult(data.text);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Sparkles size={12} />
      )}
      {loading ? "Generation..." : label}
    </button>
  );
}
