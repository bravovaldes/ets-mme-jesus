"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import Filters from "./Filters";
import { galleryItems } from "@/lib/data";

export default function Gallery() {
  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };
  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filtered.length) % filtered.length
      );
    }
  };

  return (
    <>
      <Filters active={filter} onChange={setFilter} />

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={
                    item.type === "video" && item.thumbnail
                      ? item.thumbnail
                      : item.src
                  }
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white transition-colors">
                      <Play
                        size={20}
                        className="text-charcoal ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500" />
              </div>
              <div className="p-3 bg-white">
                <p className="text-sm font-medium text-charcoal">
                  {item.title}
                </p>
                <p className="text-xs text-muted">
                  {item.location} &middot; {item.date}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Fermer"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Precedent"
            >
              <ChevronLeft size={36} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Suivant"
            >
              <ChevronRight size={36} />
            </button>

            <div
              className="flex flex-col lg:flex-row max-w-6xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media */}
              <div className="flex-1 relative min-h-[200px] sm:min-h-[300px] lg:min-h-[500px] bg-black flex items-center justify-center">
                {filtered[lightboxIndex].type === "video" ? (
                  <video
                    src={filtered[lightboxIndex].src}
                    controls
                    className="max-h-[80vh] max-w-full"
                    autoPlay
                  />
                ) : (
                  <Image
                    src={filtered[lightboxIndex].src}
                    alt={filtered[lightboxIndex].title}
                    fill
                    className="object-contain"
                    sizes="80vw"
                  />
                )}
              </div>

              {/* Info panel */}
              <div className="lg:w-80 bg-white p-6 overflow-y-auto">
                <h3 className="font-heading text-xl text-charcoal mb-4">
                  {filtered[lightboxIndex].title}
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted">Lieu</span>
                    <p className="text-charcoal">
                      {filtered[lightboxIndex].location}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">Date</span>
                    <p className="text-charcoal">
                      {filtered[lightboxIndex].date}
                    </p>
                  </div>
                  {filtered[lightboxIndex].guests && (
                    <div>
                      <span className="text-muted">Invites</span>
                      <p className="text-charcoal">
                        {filtered[lightboxIndex].guests}
                      </p>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border">
                    <p className="text-charcoal/80 leading-relaxed">
                      {filtered[lightboxIndex].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
