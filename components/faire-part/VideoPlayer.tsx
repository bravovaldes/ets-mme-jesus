"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/media-helpers";

interface VideoPlayerProps {
  url: string;
  title?: string;
  thumbnail?: string;
  accentColor: string;
  compact?: boolean;
}

export default function VideoPlayer({
  url,
  title,
  thumbnail,
  accentColor,
  compact = false,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = extractYouTubeId(url);
  const isYoutube = !!youtubeId;

  const thumbUrl = thumbnail || (youtubeId ? getYouTubeThumbnail(youtubeId) : undefined);

  // YouTube embed
  if (isYoutube && playing) {
    return (
      <div className={`relative w-full ${compact ? "aspect-video" : "aspect-video max-w-4xl mx-auto"}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title || "Video"}
        />
      </div>
    );
  }

  // Direct video playing
  if (!isYoutube && playing) {
    return (
      <div className={`relative w-full ${compact ? "aspect-video" : "aspect-video max-w-4xl mx-auto"}`}>
        <video
          src={url}
          controls
          autoPlay
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />
      </div>
    );
  }

  // Thumbnail with play button
  return (
    <button
      onClick={() => setPlaying(true)}
      className={`relative w-full group cursor-pointer overflow-hidden ${
        compact ? "aspect-video" : "aspect-video max-w-4xl mx-auto"
      }`}
    >
      {thumbUrl ? (
        <Image
          src={thumbUrl}
          alt={title || "Video"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={compact ? "50vw" : "100vw"}
        />
      ) : (
        <div className="absolute inset-0 bg-black/80" />
      )}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accentColor}CC` }}
        >
          <Play size={compact ? 24 : 32} className="text-white ml-1" fill="white" />
        </div>
        {title && !compact && (
          <p className="text-white/80 text-sm font-heading">{title}</p>
        )}
      </div>
    </button>
  );
}
