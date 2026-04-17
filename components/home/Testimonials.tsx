"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.x < -50) goNext();
    else if (info.offset.x > 50) goPrev();
  }

  return (
    <section className="bg-primary py-16 sm:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <SectionTitle title="Temoignages" light />

        <div className="relative min-h-[180px] sm:min-h-[200px] overflow-hidden touch-pan-y">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ x, opacity }}
              className="text-center cursor-grab active:cursor-grabbing select-none"
            >
              <blockquote className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl text-cream/90 italic leading-relaxed mb-6 sm:mb-8">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              <div className="text-accent-light text-sm tracking-wide">
                {testimonials[current].family},{" "}
                {testimonials[current].city}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe hint on mobile */}
        <p className="text-cream/30 text-xs text-center mt-4 sm:hidden">
          Glissez pour voir les autres temoignages
        </p>

        {/* Dots — bigger touch targets */}
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-8 flex items-center justify-center transition-all duration-300`}
              aria-label={`Temoignage ${i + 1}`}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-accent w-8"
                    : "bg-cream/30 w-2 hover:bg-cream/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
