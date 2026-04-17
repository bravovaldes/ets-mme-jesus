import type { MediaItem, MediaType } from "./types";

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Detect media type from URL
 */
export function detectMediaType(url: string): MediaType {
  if (extractYouTubeId(url)) return "video-youtube";
  if (url.match(/\.(mp4|webm|mov|avi)(\?|$)/i)) return "video-upload";
  return "photo";
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * Group media items by programme event
 */
export function groupMediaByEvent(
  media: MediaItem[],
  programmeEvents: { id: string; titre: string }[]
): Map<string, MediaItem[]> {
  const grouped = new Map<string, MediaItem[]>();

  // Init with "unlinked" group
  grouped.set("unlinked", []);

  // Init with event IDs from programme
  for (const evt of programmeEvents) {
    grouped.set(evt.id || evt.titre, []);
  }

  for (const item of media) {
    if (item.programmeEventId && grouped.has(item.programmeEventId)) {
      grouped.get(item.programmeEventId)!.push(item);
    } else {
      grouped.get("unlinked")!.push(item);
    }
  }

  return grouped;
}

/**
 * Get all programme events as flat list with IDs
 */
export function flattenProgrammeEvents(
  programme: { id: string; jour: string; evenements: { heure: string; titre: string }[] }[]
): { id: string; label: string }[] {
  const events: { id: string; label: string }[] = [];
  for (const jour of programme) {
    for (const evt of jour.evenements) {
      events.push({
        id: `${jour.id}-${evt.heure}`,
        label: `${evt.heure} — ${evt.titre}`,
      });
    }
  }
  return events;
}
