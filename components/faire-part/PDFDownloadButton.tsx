"use client";

import { useState, useCallback } from "react";
import { FileDown, Loader2 } from "lucide-react";
import type { FairePartPage } from "@/lib/types";

export default function PDFDownloadButton({ fp }: { fp: FairePartPage }) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      // Dynamic import to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");
      const { default: FairePartPDF } = await import("./FairePartPDF");

      const blob = await pdf(<FairePartPDF fp={fp} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `faire-part-${fp.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
    }
  }, [fp]);

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 text-xs text-cream/80 hover:text-cream border border-cream/20 hover:border-cream/40 transition-colors disabled:opacity-50"
    >
      {generating ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <FileDown size={14} />
      )}
      <span className="hidden sm:inline">
        {generating ? "Generation..." : "Telecharger PDF"}
      </span>
    </button>
  );
}
