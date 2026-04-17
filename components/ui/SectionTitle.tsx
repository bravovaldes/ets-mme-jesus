"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  light = false,
  className = "",
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`text-center mb-10 sm:mb-16 ${className}`}
    >
      <h2
        className={`font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 sm:mb-6 ${
          light ? "text-cream" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            light ? "text-cream/80" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`w-20 h-px mx-auto mt-8 ${
          light ? "bg-accent-light" : "bg-accent"
        }`}
      />
    </motion.div>
  );
}
