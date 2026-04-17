"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/data";

export default function Process() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-charcoal font-normal mb-4">
            Notre processus
          </h2>
          <div className="w-16 h-px bg-accent mx-auto" />
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8 sm:space-y-12">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-14 sm:pl-20"
              >
                {/* Number circle */}
                <div className="absolute left-0 top-0 w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 border-accent bg-cream flex items-center justify-center">
                  <span className="font-heading text-lg sm:text-2xl text-accent">
                    {step.number}
                  </span>
                </div>

                <div className="pt-1 sm:pt-2">
                  <h3 className="font-heading text-lg sm:text-xl text-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
