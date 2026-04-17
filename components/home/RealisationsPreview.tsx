"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { galleryItems } from "@/lib/data";

export default function RealisationsPreview() {
  const photos = galleryItems.filter((item) => item.type === "photo").slice(0, 6);

  return (
    <section className="bg-cream py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Nos dernieres realisations"
          subtitle="Chaque ceremonie est unique. Decouvrez quelques-uns des hommages que nous avons organises."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: i * 0.08,
              }}
              className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:saturate-100 saturate-[0.85]"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-cream text-sm font-medium">{item.title}</p>
                <p className="text-cream/70 text-xs">{item.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/realisations"
            className="text-accent hover:text-accent-dark transition-colors text-sm tracking-wide"
          >
            Voir toutes nos realisations &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
