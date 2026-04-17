"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Mission() {
  return (
    <section className="bg-cream py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-charcoal font-normal mb-6 sm:mb-8 leading-tight">
              Un accompagnement complet, dans le respect des traditions
            </h2>
            <div className="w-16 h-px bg-accent mb-8" />
            <div className="space-y-6 text-charcoal/80 leading-relaxed">
              <p>
                Perdre un proche est une epreuve. Au milieu de la douleur, les
                familles doivent organiser une ceremonie digne, souvent en
                quelques jours. C&apos;est la que nous intervenons.
              </p>
              <p>
                ETS Mme Jesus prend en charge l&apos;integralite de
                l&apos;organisation : de la chapelle ardente a la reception, de
                la decoration a la coordination des prestataires, du transport a
                l&apos;impression des faire-parts.
              </p>
              <p>
                Notre engagement : vous offrir la serenite d&apos;un hommage
                reussi, dans le respect de vos traditions et de votre budget.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-[4/5] lg:aspect-[3/4]"
          >
            <Image
              src="/images/mission.jpg"
              alt="Ceremonie organisee par ETS Mme Jesus"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border border-accent/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
