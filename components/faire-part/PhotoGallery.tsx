"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  Pause,
  Maximize2,
  Grid3X3,
} from "lucide-react";
import type { PhotoItem, PhotoTag } from "@/lib/types";
import { PHOTO_TAGS } from "@/lib/types";

interface PhotoGalleryProps {
  photos: PhotoItem[];
  allowDownload: boolean;
  accentColor: string;
  primaryColor: string;
}

export default function PhotoGallery({
  photos,
  allowDownload,
  accentColor,
  primaryColor,
}: PhotoGalleryProps) {
  const [activeTag, setActiveTag] = useState<PhotoTag | "all">("all");
  const [slideIndex, setSlideIndex] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const filtered =
    activeTag === "all"
      ? photos
      : photos.filter((p) => p.tags?.includes(activeTag));

  // Get unique tags from photos
  const usedTags = Array.from(
    new Set(photos.flatMap((p) => p.tags || []))
  );

  // Auto-play slideshow
  useEffect(() => {
    if (!autoPlay || slideIndex === null) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) =>
        prev !== null ? (prev + 1) % filtered.length : 0
      );
    }, 4000);
    return () => clearInterval(timer);
  }, [autoPlay, slideIndex, filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (slideIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setSlideIndex((prev) => prev !== null ? (prev + 1) % filtered.length : 0);
      if (e.key === "ArrowLeft") setSlideIndex((prev) => prev !== null ? (prev - 1 + filtered.length) % filtered.length : 0);
      if (e.key === "Escape") setSlideIndex(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slideIndex, filtered.length]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null || slideIndex === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setSlideIndex((slideIndex + 1) % filtered.length);
      else setSlideIndex((slideIndex - 1 + filtered.length) % filtered.length);
    }
    setTouchStart(null);
  }

  if (photos.length === 0) return null;

  return (
    <>
      {/* Tags filter */}
      {usedTags.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveTag("all")}
            className={`px-4 py-1.5 text-xs border transition-all ${
              activeTag === "all"
                ? "text-white"
                : "text-white/60 border-white/20 hover:border-white/40"
            }`}
            style={activeTag === "all" ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
          >
            Toutes ({photos.length})
          </button>
          {usedTags.map((tag) => {
            const label = PHOTO_TAGS.find((t) => t.value === tag)?.label || tag;
            const count = photos.filter((p) => p.tags?.includes(tag)).length;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 text-xs border transition-all ${
                  activeTag === tag
                    ? "text-white"
                    : "text-white/60 border-white/20 hover:border-white/40"
                }`}
                style={activeTag === tag ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square group cursor-pointer overflow-hidden"
              onClick={() => { setSlideIndex(i); setAutoPlay(false); }}
            >
              <Image
                src={photo.url}
                alt={photo.caption || "Photo"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 size={24} className="text-white" />
              </div>

              {/* Caption */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] sm:text-xs truncate">{photo.caption}</p>
                </div>
              )}

              {/* Download icon */}
              {photo.isDownloadable && allowDownload && (
                <a
                  href={photo.url}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Telecharger"
                >
                  <Download size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Slideshow button */}
      <div className="text-center mt-6">
        <button
          onClick={() => { setSlideIndex(0); setAutoPlay(true); }}
          className="inline-flex items-center gap-2 px-5 py-2 border text-xs transition-all"
          style={{ borderColor: `${accentColor}50`, color: accentColor }}
        >
          <Play size={14} /> Lancer le diaporama
        </button>
      </div>

      {/* ====== FULLSCREEN SLIDESHOW ====== */}
      <AnimatePresence>
        {slideIndex !== null && filtered[slideIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/80 z-10">
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs">
                  {slideIndex + 1} / {filtered.length}
                </span>
                {filtered[slideIndex].caption && (
                  <span className="text-white/70 text-xs hidden sm:inline">
                    {filtered[slideIndex].caption}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Auto-play toggle */}
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  {autoPlay ? <Pause size={18} /> : <Play size={18} />}
                </button>
                {/* Grid view */}
                <button
                  onClick={() => setSlideIndex(null)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <Grid3X3 size={18} />
                </button>
                {/* Download */}
                {filtered[slideIndex].isDownloadable && allowDownload && (
                  <a
                    href={filtered[slideIndex].url}
                    download
                    className="p-2 text-white/50 hover:text-white transition-colors"
                  >
                    <Download size={18} />
                  </a>
                )}
                {/* Close */}
                <button
                  onClick={() => setSlideIndex(null)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={filtered[slideIndex].url}
                    alt={filtered[slideIndex].caption || "Photo"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              <button
                onClick={() => setSlideIndex((slideIndex - 1 + filtered.length) % filtered.length)}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 text-white/30 hover:text-white transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={() => setSlideIndex((slideIndex + 1) % filtered.length)}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 text-white/30 hover:text-white transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="bg-black/80 px-4 py-3 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {filtered.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setSlideIndex(i)}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 overflow-hidden border-2 transition-all ${
                      i === slideIndex ? "opacity-100" : "opacity-40 hover:opacity-70"
                    }`}
                    style={{ borderColor: i === slideIndex ? accentColor : "transparent" }}
                  >
                    <Image src={photo.url} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Progress bar for auto-play */}
            {autoPlay && (
              <motion.div
                key={`progress-${slideIndex}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="h-0.5"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
