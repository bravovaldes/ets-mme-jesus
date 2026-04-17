"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  Flower2,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";

const previewServices = [
  {
    icon: ClipboardList,
    title: "Organisation complete",
    description:
      "De l'annonce au recueillement, nous orchestrons chaque etape avec rigueur et sensibilite.",
    href: "/services#organisation-complete",
  },
  {
    icon: Flower2,
    title: "Decoration & mise en scene",
    description:
      "Des lieux a la hauteur de l'hommage que vous souhaitez rendre a votre proche.",
    href: "/services#decoration-amenagement",
  },
  {
    icon: Truck,
    title: "Logistique & coordination",
    description:
      "Transport, traiteur, sonorisation, impression : tout est pris en charge par nos equipes.",
    href: "/services#location-materiel",
  },
  {
    icon: Users,
    title: "Accompagnement familles",
    description:
      "Une presence rassurante et discrete a chaque instant du processus.",
    href: "/services#accompagnement-administratif",
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Nos services"
          subtitle="Un accompagnement sur mesure, de la veillee a la levee de deuil."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {previewServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: i * 0.1,
              }}
            >
              <Link
                href={service.href}
                className="group block p-5 sm:p-8 border border-border hover:border-accent/30 transition-all duration-500 h-full"
              >
                <service.icon
                  size={28}
                  className="text-accent mb-6"
                  strokeWidth={1.5}
                />
                <h3 className="font-heading text-xl text-charcoal mb-4">
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <span className="text-accent text-sm group-hover:translate-x-1 inline-block transition-transform duration-300">
                  En savoir plus &rarr;
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
