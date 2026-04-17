"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Camera,
  Film,
  Download,
  X,
  Pause,
  BookOpen,
} from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import type { MediaItem, FairePartPage } from "@/lib/types";
import { MEDIA_TAGS } from "@/lib/types";
import { flattenProgrammeEvents } from "@/lib/media-helpers";

interface ChronicleProps {
  fp: FairePartPage;
  accentColor: string;
  primaryColor: string;
}

export default function Chronicle({ fp, accentColor, primaryColor }: ChronicleProps) {
  const [storyMode, setStoryMode] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyAutoPlay, setStoryAutoPlay] = useState(true);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  const allMedia = fp.photos || [];
  const programmeEvents = flattenProgrammeEvents(fp.programme);

  // Group media: first by programme events, then by tags
  const sections = useMemo(() => {
    const result: { id: string; title: string; subtitle?: string; media: MediaItem[] }[] = [];

    for (const evt of programmeEvents) {
      const eventMedia = allMedia.filter((m) => m.programmeEventId === evt.id);
      if (eventMedia.length > 0) {
        result.push({
          id: evt.id,
          title: evt.label.split(" — ")[1] || evt.label,
          subtitle: evt.label.split(" — ")[0],
          media: eventMedia.sort((a, b) => a.order - b.order),
        });
      }
    }

    const unlinked = allMedia.filter((m) => !m.programmeEventId);
    if (unlinked.length > 0) {
      const tagGroups = new Map<string, MediaItem[]>();
      for (const m of unlinked) {
        const tag = m.tags?.[0] || "autre";
        if (!tagGroups.has(tag)) tagGroups.set(tag, []);
        tagGroups.get(tag)!.push(m);
      }
      for (const [tag, media] of tagGroups) {
        const label = MEDIA_TAGS.find((t) => t.value === tag)?.label || "Photos";
        result.push({ id: `tag-${tag}`, title: label, media: media.sort((a, b) => a.order - b.order) });
      }
    }

    return result;
  }, [allMedia, programmeEvents]);

  const storyItems = useMemo(
    () => allMedia.filter((m) => m.type === "photo").sort((a, b) => a.order - b.order),
    [allMedia]
  );

  // Story auto-advance
  useEffect(() => {
    if (!storyMode || !storyAutoPlay) return;
    const timer = setInterval(() => {
      setStoryIndex((prev) => {
        if (prev >= storyItems.length - 1) { setStoryMode(false); return 0; }
        return prev + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [storyMode, storyAutoPlay, storyItems.length]);

  if (allMedia.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}10` }}>
          <BookOpen size={28} style={{ color: `${accentColor}40` }} />
        </div>
        <p className="font-heading text-lg text-cream/40 mb-2">L&apos;album souvenir est en preparation</p>
        <p className="text-cream/20 text-xs max-w-sm mx-auto">
          Les photos et videos de la ceremonie seront ajoutees ici par la famille et les proches apres l&apos;evenement.
        </p>
      </div>
    );
  }

  const totalPhotos = allMedia.filter((m) => m.type === "photo").length;
  const totalVideos = allMedia.filter((m) => m.type !== "photo").length;

  return (
    <>
      {/* Album header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="flex items-center justify-center gap-3 text-cream/25 text-[10px] sm:text-xs mb-4 sm:mb-6">
          {totalPhotos > 0 && (
            <span className="flex items-center gap-1"><Camera size={11} /> {totalPhotos} photo{totalPhotos > 1 ? "s" : ""}</span>
          )}
          {totalVideos > 0 && (
            <span className="flex items-center gap-1"><Film size={11} /> {totalVideos} video{totalVideos > 1 ? "s" : ""}</span>
          )}
        </div>
        {storyItems.length > 2 && (
          <button
            onClick={() => { setStoryMode(true); setStoryIndex(0); setStoryAutoPlay(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm transition-all hover:bg-white/5 border"
            style={{ borderColor: `${accentColor}40`, color: accentColor }}
          >
            <Play size={14} /> Revivre la ceremonie
          </button>
        )}
      </div>

      {/* Album sections */}
      <div className="space-y-14">
        {sections.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: si * 0.05 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
                <Camera size={14} style={{ color: accentColor }} />
              </div>
              <div className="flex-1 min-w-0">
                {section.subtitle && (
                  <p className="text-[9px] sm:text-[10px] tracking-wider" style={{ color: `${accentColor}60` }}>{section.subtitle}</p>
                )}
                <h3 className="font-heading text-sm sm:text-lg text-cream truncate">{section.title}</h3>
              </div>
              <span className="text-cream/15 text-[10px]">{section.media.length}</span>
            </div>

            {/* Polaroid-style album grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {section.media.map((item, mi) => {
                // Vary sizes: first and every 5th item is bigger
                const isFeatured = mi === 0 && section.media.length > 3;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: mi * 0.04 }}
                    className={`group ${isFeatured ? "col-span-2 row-span-2" : ""}`}
                  >
                    {item.type === "photo" ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => setFullscreenPhoto(item.url)}
                      >
                        {/* Polaroid card */}
                        <div className="bg-white p-1 sm:p-1.5 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-sm">
                          <div className={`relative overflow-hidden ${isFeatured ? "aspect-[4/3]" : "aspect-square"}`}>
                            <Image
                              src={item.url}
                              alt={item.caption || ""}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes={isFeatured ? "50vw" : "(max-width: 640px) 50vw, 25vw"}
                            />
                            {/* Download overlay */}
                            {item.isDownloadable && fp.allowPhotoDownload && (
                              <a href={item.url} download onClick={(e) => e.stopPropagation()}
                                className="absolute top-2 right-2 w-7 h-7 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <Download size={12} className="text-white" />
                              </a>
                            )}
                          </div>
                          {/* Caption area */}
                          <div className="pt-1.5 sm:pt-2 pb-0.5 px-0.5">
                            {item.caption ? (
                              <p className="text-[10px] sm:text-xs text-charcoal/70 leading-relaxed truncate">{item.caption}</p>
                            ) : (
                              <div className="h-3" />
                            )}
                            {item.addedBy && (
                              <p className="text-[8px] sm:text-[10px] text-charcoal/30 mt-0.5">par {item.addedBy}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Video */
                      <div className="bg-white p-1 sm:p-1.5 shadow-sm rounded-sm">
                        <div className={isFeatured ? "aspect-[4/3]" : "aspect-square"}>
                          <VideoPlayer url={item.url} title={item.caption} thumbnail={item.thumbnail} accentColor={accentColor} compact />
                        </div>
                        <div className="pt-1.5 pb-0.5 px-0.5">
                          {item.caption && <p className="text-[10px] sm:text-xs text-charcoal/70 truncate">{item.caption}</p>}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ====== FULLSCREEN PHOTO ====== */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setFullscreenPhoto(null)}>
            <button onClick={() => setFullscreenPhoto(null)} className="absolute top-4 right-4 text-white/50 hover:text-white z-10"><X size={24} /></button>
            <div className="relative w-full h-full"><Image src={fullscreenPhoto} alt="" fill className="object-contain" sizes="100vw" /></div>
            {fp.allowPhotoDownload && allMedia.find((m) => m.url === fullscreenPhoto)?.isDownloadable && (
              <a href={fullscreenPhoto} download onClick={(e) => e.stopPropagation()} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-white/90 text-charcoal text-xs"><Download size={14} /> Telecharger</a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== STORY MODE — "Revivre la ceremonie" ====== */}
      <AnimatePresence>
        {storyMode && storyItems.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Progress bars */}
            <div className="flex gap-0.5 px-4 pt-3">
              {storyItems.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/10">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: accentColor }}
                    initial={{ width: i < storyIndex ? "100%" : "0%" }}
                    animate={{ width: i < storyIndex ? "100%" : i === storyIndex && storyAutoPlay ? "100%" : "0%" }}
                    transition={i === storyIndex && storyAutoPlay ? { duration: 3.5, ease: "linear" } : { duration: 0 }}
                  />
                </div>
              ))}
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2 z-10">
              <span className="text-white/30 text-xs">{storyIndex + 1} / {storyItems.length}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setStoryAutoPlay(!storyAutoPlay)} className="p-2 text-white/40 hover:text-white">
                  {storyAutoPlay ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={() => setStoryMode(false)} className="p-2 text-white/40 hover:text-white"><X size={18} /></button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 relative"
              onClick={(e) => {
                const x = (e as React.MouseEvent).clientX;
                const w = window.innerWidth;
                if (x < w / 3) setStoryIndex(Math.max(0, storyIndex - 1));
                else if (x > (2 * w) / 3) setStoryIndex(Math.min(storyItems.length - 1, storyIndex + 1));
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={storyIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }} className="absolute inset-0">
                  <Image src={storyItems[storyIndex].url} alt="" fill className="object-contain" sizes="100vw" priority />
                </motion.div>
              </AnimatePresence>

              {/* Caption */}
              {storyItems[storyIndex]?.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <p className="text-white text-sm sm:text-base font-heading">{storyItems[storyIndex].caption}</p>
                  {storyItems[storyIndex].addedBy && (
                    <p className="text-white/40 text-xs mt-1">par {storyItems[storyIndex].addedBy}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
