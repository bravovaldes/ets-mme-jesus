"use client";

import { motion } from "framer-motion";
import {
  Wine,
  Beef,
  Scissors,
  Banknote,
  Package,
  CircleDot,
  GlassWater,
} from "lucide-react";
import type { DotItem } from "@/lib/types";
import { DOT_CATEGORIES } from "@/lib/types";

interface DotDisplayProps {
  items: DotItem[];
  accentColor: string;
  primaryColor: string;
}

const CATEGORY_ICONS: Record<string, typeof Wine> = {
  boisson: GlassWater,
  nourriture: Beef,
  animal: Beef,
  tissu: Scissors,
  argent: Banknote,
  objet: Package,
  autre: CircleDot,
};

export default function DotDisplay({
  items,
  accentColor,
  primaryColor,
}: DotDisplayProps) {
  // Group items by category
  const grouped = items.reduce<Record<string, DotItem[]>>((acc, item) => {
    const cat = item.categorie || "autre";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {categories.map((cat, ci) => {
        const catInfo = DOT_CATEGORIES.find((c) => c.value === cat);
        const Icon = CATEGORY_ICONS[cat] || CircleDot;
        const catItems = grouped[cat];

        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: ci * 0.06 }}
            className="border rounded-lg p-4 sm:p-5"
            style={{ borderColor: `${accentColor}25` }}
          >
            {/* Category header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}12` }}
              >
                <Icon size={15} style={{ color: accentColor }} />
              </div>
              <h4
                className="font-heading text-sm tracking-wider uppercase"
                style={{ color: accentColor }}
              >
                {catInfo?.label || cat}
              </h4>
            </div>

            {/* Items */}
            <div className="space-y-2 ml-10">
              {catItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{
                      backgroundColor: item.estObligatoire
                        ? accentColor
                        : `${accentColor}40`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-sm"
                      style={{ color: primaryColor }}
                    >
                      {item.nom}
                    </span>
                    {item.quantite && (
                      <span
                        className="text-sm"
                        style={{ color: `${primaryColor}60` }}
                      >
                        {" "}
                        — {item.quantite}
                      </span>
                    )}
                    {item.description && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: `${primaryColor}40` }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="sm:col-span-2 flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: `${primaryColor}50` }}
          >
            Obligatoire
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: `${accentColor}40` }}
          />
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: `${primaryColor}50` }}
          >
            Optionnel
          </span>
        </div>
      </div>
    </div>
  );
}
