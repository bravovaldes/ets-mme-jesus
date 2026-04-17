"use client";

import { useState } from "react";
import { Phone, X } from "lucide-react";

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false);
  const phone = process.env.NEXT_PUBLIC_PHONE || "+1 418 490 1849";

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden">
      <div className="bg-primary border-t border-accent/30 px-4 py-3 flex items-center justify-between gap-3">
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <Phone size={16} className="text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-cream text-xs font-medium">Urgence 24h/24</p>
            <p className="text-accent-light text-sm font-heading truncate">
              {phone}
            </p>
          </div>
        </a>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "14184901849"}?text=${encodeURIComponent("Bonjour, je vous contacte depuis votre site web.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-2 bg-whatsapp text-white text-xs rounded-sm"
        >
          WhatsApp
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-cream/40 p-1"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
