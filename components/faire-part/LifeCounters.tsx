"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { FairePartPage } from "@/lib/types";

interface LifeCountersProps {
  fp: FairePartPage;
  accentColor: string;
}

function AnimatedCounter({
  value,
  suffix,
  label,
  inView,
  accentColor,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  inView: boolean;
  accentColor: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <span className="font-heading text-4xl sm:text-5xl" style={{ color: accentColor }}>
        {count}{suffix}
      </span>
      <p className="text-cream/40 text-xs sm:text-sm mt-2">{label}</p>
    </motion.div>
  );
}

export default function LifeCounters({ fp, accentColor }: LifeCountersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const mainPerson = fp.personnes[0];
  const isFunerailles = fp.eventType === "funerailles" || fp.eventType === "levee-de-deuil";

  // Calculate stats
  const stats: { value: number; suffix?: string; label: string }[] = [];

  if (isFunerailles) {
    if (mainPerson.ageAuDeces) {
      stats.push({ value: mainPerson.ageAuDeces, label: "annees de vie" });
    }

    const nbEnfants = fp.famille?.find((f) => f.categorie === "enfants")?.membres.length;
    if (nbEnfants && nbEnfants > 0) {
      stats.push({ value: nbEnfants, label: "enfants" });
    }

    const nbPetitsEnfants = fp.famille?.find((f) => f.categorie === "petits-enfants")?.membres.length;
    if (nbPetitsEnfants && nbPetitsEnfants > 0) {
      // Check if it's a number mention like "22 petits-enfants"
      const firstMembre = fp.famille?.find((f) => f.categorie === "petits-enfants")?.membres[0];
      if (firstMembre) {
        const num = parseInt(firstMembre.nom);
        if (!isNaN(num)) {
          stats.push({ value: num, label: "petits-enfants" });
        } else {
          stats.push({ value: nbPetitsEnfants, label: "petits-enfants" });
        }
      }
    }
  }

  // Condolences count
  stats.push({ value: fp.photos?.length || 0, label: "photos partagees", suffix: "" });

  if (stats.length < 2) return null;

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
      {stats.map((stat, i) => (
        <AnimatedCounter
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          inView={inView}
          accentColor={accentColor}
          delay={i * 0.15}
        />
      ))}
    </div>
  );
}
