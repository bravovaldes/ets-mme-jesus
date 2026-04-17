"use client";

import { motion } from "framer-motion";
import type { EventType, FairePartDesign } from "@/lib/types";
import { EVENT_TYPE_LABELS, DEFAULT_DESIGNS } from "@/lib/types";

const eventTypes: { type: EventType; description: string }[] = [
  { type: "funerailles", description: "Annonce de deces et programme des obseques" },
  { type: "mariage-traditionnel", description: "Mariage traditionnel (dot) avec liste de la dot" },
  { type: "mariage-civil", description: "Ceremonie civile a la mairie" },
  { type: "mariage-religieux", description: "Ceremonie religieuse a l'eglise/temple" },
  { type: "levee-de-deuil", description: "Ceremonie de fin de deuil, quelques mois apres" },
  { type: "bapteme", description: "Bapteme religieux et ceremonie de nommage" },
];

const designOptions: { key: string; label: string; design: FairePartDesign }[] = Object.entries(
  DEFAULT_DESIGNS
).map(([key, design]) => ({
  key,
  label: key
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  design,
}));

interface Step1Props {
  eventType: EventType;
  designKey: string;
  onChangeType: (type: EventType) => void;
  onChangeDesign: (key: string, design: FairePartDesign) => void;
}

export default function Step1Type({
  eventType,
  designKey,
  onChangeType,
  onChangeDesign,
}: Step1Props) {
  // Filter design options relevant to event type
  const relevantDesigns = designOptions.filter((d) => {
    if (eventType.startsWith("mariage")) return d.key.startsWith("mariage");
    if (eventType === "bapteme") return d.key === "bapteme";
    if (eventType === "levee-de-deuil") return d.key.startsWith("funerailles") || d.key === "levee-deuil";
    return d.key.startsWith("funerailles") || d.key === "levee-deuil";
  });

  return (
    <div className="space-y-8">
      {/* Event type */}
      <div>
        <h3 className="font-heading text-xl text-charcoal mb-1">
          Type d&apos;evenement
        </h3>
        <p className="text-muted text-sm mb-6">
          Choisissez le type de faire-part que vous souhaitez creer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {eventTypes.map((et) => (
            <button
              key={et.type}
              onClick={() => onChangeType(et.type)}
              className={`text-left p-4 border transition-all duration-300 ${
                eventType === et.type
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <p className="text-sm font-medium text-charcoal">
                {EVENT_TYPE_LABELS[et.type]}
              </p>
              <p className="text-xs text-muted mt-1">{et.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Design template */}
      <div>
        <h3 className="font-heading text-xl text-charcoal mb-1">
          Modele de design
        </h3>
        <p className="text-muted text-sm mb-6">
          Choisissez le style visuel de votre faire-part.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {relevantDesigns.map((d) => (
            <motion.button
              key={d.key}
              whileHover={{ scale: 1.02 }}
              onClick={() => onChangeDesign(d.key, d.design)}
              className={`relative overflow-hidden border-2 transition-all duration-300 ${
                designKey === d.key
                  ? "border-accent shadow-md"
                  : "border-border hover:border-accent/30"
              }`}
            >
              {/* Preview swatch */}
              <div className="aspect-[3/4]">
                <div
                  className="h-1/2 flex items-center justify-center"
                  style={{ backgroundColor: d.design.primaryColor }}
                >
                  <div
                    className="w-10 h-14 border-2"
                    style={{ borderColor: d.design.accentColor }}
                  />
                </div>
                <div
                  className="h-1/4 flex items-center justify-center"
                  style={{ backgroundColor: d.design.backgroundColor }}
                >
                  <div className="w-12 h-1" style={{ backgroundColor: d.design.accentColor }} />
                </div>
                <div
                  className="h-1/4"
                  style={{ backgroundColor: d.design.primaryColor }}
                />
              </div>
              <p className="text-[10px] text-center py-2 text-charcoal truncate px-1">
                {d.label}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
