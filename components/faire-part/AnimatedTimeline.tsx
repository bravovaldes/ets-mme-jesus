"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import type { ProgrammeJour } from "@/lib/types";

interface AnimatedTimelineProps {
  programme: ProgrammeJour[];
  accentColor: string;
  primaryColor: string;
}

export default function AnimatedTimeline({
  programme,
  accentColor,
  primaryColor,
}: AnimatedTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      {programme.map((jour, ji) => (
        <div key={jour.id} className="mb-12 last:mb-0">
          {/* Day header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <span className="text-white font-heading text-lg sm:text-xl">
                J{ji + 1}
              </span>
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl text-cream">
                {jour.jour}
              </h3>
              <p className="text-cream/40 text-xs">
                {jour.evenements.length} evenement{jour.evenements.length > 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>

          {/* Events */}
          <div className="relative ml-6 sm:ml-7">
            {/* Vertical line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ backgroundColor: `${accentColor}25` }}
            />

            <div className="space-y-1">
              {jour.evenements.map((evt, ei) => (
                <TimelineEvent
                  key={ei}
                  evt={evt}
                  index={ei}
                  total={jour.evenements.length}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineEvent({
  evt,
  index,
  total,
  accentColor,
}: {
  evt: ProgrammeJour["evenements"][0];
  index: number;
  total: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative pl-8 sm:pl-10 pb-6 last:pb-0 group"
    >
      {/* Dot on the line */}
      <div
        className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-300 group-hover:scale-125"
        style={{
          borderColor: accentColor,
          backgroundColor: index === 0 ? accentColor : "transparent",
        }}
      />

      {/* Card */}
      <div
        className="border p-4 sm:p-5 transition-all duration-300 group-hover:translate-x-1"
        style={{ borderColor: `${accentColor}15` }}
      >
        <div className="flex items-start gap-3">
          {/* Time */}
          <div className="shrink-0">
            <span
              className="font-heading text-xl sm:text-2xl"
              style={{ color: accentColor }}
            >
              {evt.heure}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-medium text-cream">
              {evt.titre}
            </h4>

            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin size={11} style={{ color: `${accentColor}80` }} />
              <p className="text-cream/50 text-xs truncate">{evt.lieu}</p>
            </div>

            {evt.description && (
              <p className="text-cream/35 text-xs mt-2 leading-relaxed">
                {evt.description}
              </p>
            )}

            {evt.codeVestimentaire && (
              <div className="flex items-center gap-1.5 mt-2">
                <Clock size={10} style={{ color: `${accentColor}60` }} />
                <p className="text-xs italic" style={{ color: `${accentColor}60` }}>
                  {evt.codeVestimentaire}
                </p>
              </div>
            )}

            {evt.celebrant && (
              <p className="text-cream/30 text-[10px] mt-1">
                Celebrant : {evt.celebrant}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
