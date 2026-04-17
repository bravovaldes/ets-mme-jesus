"use client";

import { motion } from "framer-motion";
import { Crown, Award, Clock, Shield } from "lucide-react";
import { values } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Crown,
  Award,
  Clock,
  Shield,
};

export default function Values() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-charcoal font-normal mb-4">
            Nos valeurs
          </h2>
          <div className="w-16 h-px bg-accent mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, i) => {
            const Icon = iconMap[value.icon] || Crown;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-5 sm:p-8 border border-border"
              >
                <Icon
                  size={28}
                  className="text-accent mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="font-heading text-xl text-charcoal mb-3">
                  {value.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
