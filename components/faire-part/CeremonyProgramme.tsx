"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Church,
  Crown,
  Building2,
  UtensilsCrossed,
  Car,
  Flame,
  CalendarDays,
  Shirt,
  User,
} from "lucide-react";
import type { ProgrammeJour, ProgrammeEvenement } from "@/lib/types";

interface CeremonyProgrammeProps {
  programme: ProgrammeJour[];
  accentColor: string;
  primaryColor: string;
  backgroundColor: string;
}

const EVENT_ICONS: Record<string, typeof Church> = {
  religieux: Church,
  traditionnel: Crown,
  civil: Building2,
  reception: UtensilsCrossed,
  cortege: Car,
  veillee: Flame,
  autre: CalendarDays,
};

function getEventIcon(type?: string) {
  return EVENT_ICONS[type || "autre"] || CalendarDays;
}

function EventCard({
  evt,
  index,
  accentColor,
  primaryColor,
}: {
  evt: ProgrammeEvenement;
  index: number;
  accentColor: string;
  primaryColor: string;
}) {
  const Icon = getEventIcon(evt.typeEvenement);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="flex gap-3 sm:gap-4 group"
    >
      {/* Time column */}
      <div className="shrink-0 w-16 sm:w-20 pt-3 text-right">
        <span
          className="font-heading text-lg sm:text-xl font-semibold"
          style={{ color: accentColor }}
        >
          {evt.heure}
        </span>
      </div>

      {/* Icon + connector */}
      <div className="relative flex flex-col items-center shrink-0">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accentColor}15`, border: `1.5px solid ${accentColor}40` }}
        >
          <Icon size={16} style={{ color: accentColor }} />
        </div>
        {/* Connector line */}
        <div className="flex-1 w-px mt-1" style={{ backgroundColor: `${accentColor}20` }} />
      </div>

      {/* Content card */}
      <div
        className="flex-1 pb-6 last:pb-0"
      >
        <div
          className="bg-white/70 border rounded-lg p-3.5 sm:p-4 transition-all duration-300 group-hover:shadow-sm group-hover:bg-white/90"
          style={{ borderColor: `${accentColor}20` }}
        >
          <h4
            className="font-heading text-sm sm:text-base font-medium leading-snug"
            style={{ color: primaryColor }}
          >
            {evt.titre}
          </h4>

          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin size={12} style={{ color: `${accentColor}90` }} />
            <p className="text-xs" style={{ color: `${primaryColor}90` }}>
              {evt.lieu}
            </p>
          </div>

          {evt.description && (
            <p
              className="text-xs mt-2 leading-relaxed"
              style={{ color: `${primaryColor}60` }}
            >
              {evt.description}
            </p>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mt-2.5 empty:mt-0">
            {evt.codeVestimentaire && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs"
                style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
              >
                <Shirt size={10} />
                {evt.codeVestimentaire}
              </span>
            )}
            {evt.celebrant && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs"
                style={{ backgroundColor: `${primaryColor}08`, color: `${primaryColor}70` }}
              >
                <User size={10} />
                {evt.celebrant}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CeremonyProgramme({
  programme,
  accentColor,
  primaryColor,
  backgroundColor,
}: CeremonyProgrammeProps) {
  return (
    <div className="space-y-10">
      {programme.map((jour, ji) => (
        <div key={jour.id}>
          {/* Day header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-lg"
              style={{ backgroundColor: `${primaryColor}08` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-heading font-semibold"
                style={{ backgroundColor: accentColor }}
              >
                J{ji + 1}
              </div>
              <div>
                <h3
                  className="font-heading text-base sm:text-lg font-medium"
                  style={{ color: primaryColor }}
                >
                  {jour.jour}
                </h3>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: `${primaryColor}50` }}>
                  {jour.evenements.length} evenement{jour.evenements.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Events list */}
          <div>
            {jour.evenements.map((evt, ei) => (
              <EventCard
                key={ei}
                evt={evt}
                index={ei}
                accentColor={accentColor}
                primaryColor={primaryColor}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
