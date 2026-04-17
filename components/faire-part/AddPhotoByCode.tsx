"use client";

import { useState } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Camera, Upload, Lock, Check, Loader2 } from "lucide-react";
import type { MediaItem, MediaTag, MediaType } from "@/lib/types";
import { MEDIA_TAGS } from "@/lib/types";
import { detectMediaType, extractYouTubeId, getYouTubeThumbnail } from "@/lib/media-helpers";

interface AddPhotoByCodeProps {
  fairePartId: string;
  slug: string;
  programmeEvents?: { id: string; label: string }[];
  accessCode?: string;
  accentColor: string;
  onPhotoAdded: () => void;
}

export default function AddPhotoByCode({
  fairePartId,
  slug,
  programmeEvents,
  accessCode,
  accentColor,
  onPhotoAdded,
}: AddPhotoByCodeProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [files, setFiles] = useState<{ file: File; preview: string; caption: string; tag: MediaTag; eventId: string; addedBy: string }[]>([]);
  const [addedByName, setAddedByName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  function handleUnlock() {
    // Code is the last 4 digits of the fairePartId or a custom code
    const validCode = accessCode || fairePartId.slice(-4);
    if (code === validCode) {
      setUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  }

  function handleFilesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;
    const newFiles = Array.from(selected).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      tag: "autre" as MediaTag,
      eventId: "",
      addedBy: addedByName,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  }

  function updateFile(index: number, field: "caption" | "tag" | "eventId" | "addedBy", value: string) {
    setFiles((prev) => prev.map((f, i) => i === index ? { ...f, [field]: value } : f));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (!db || !storage || files.length === 0) return;
    setUploading(true);

    try {
      for (const item of files) {
        const storageRef = ref(storage, `faire-parts/${slug}/community/${Date.now()}-${item.file.name}`);
        await uploadBytes(storageRef, item.file);
        const url = await getDownloadURL(storageRef);

        const photo: MediaItem = {
          id: `community-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          type: "photo" as MediaType,
          url,
          caption: item.caption || undefined,
          addedBy: item.addedBy || addedByName || undefined,
          tags: [item.tag],
          programmeEventId: item.eventId || undefined,
          isDownloadable: true,
          isCover: false,
          isRecap: false,
          order: 999,
        };

        // Add to faire-part's photos array
        const docRef = doc(db, "faireParts", fairePartId);
        await updateDoc(docRef, {
          photos: arrayUnion(photo),
        });
      }

      setDone(true);
      setFiles([]);
      onPhotoAdded();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  // Step 1: Enter code
  if (!unlocked) {
    return (
      <div className="text-center py-6">
        <div className="max-w-xs mx-auto">
          <div className="flex items-center gap-2 justify-center mb-3">
            <Camera size={16} style={{ color: accentColor }} />
            <span className="text-cream/70 text-sm">Ajouter des photos</span>
          </div>
          <p className="text-cream/40 text-xs mb-4">
            Entrez le code du faire-part pour ajouter vos photos et souvenirs.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setCodeError(false); }}
              maxLength={6}
              placeholder="Code"
              className={`flex-1 px-4 py-2.5 text-center text-sm tracking-[0.3em] border bg-transparent text-cream focus:outline-none ${
                codeError ? "border-red-400" : ""
              }`}
              style={{ borderColor: codeError ? undefined : `${accentColor}30` }}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />
            <button
              onClick={handleUnlock}
              className="px-4 py-2.5 text-sm"
              style={{ backgroundColor: accentColor, color: "white" }}
            >
              <Lock size={16} />
            </button>
          </div>
          {codeError && (
            <p className="text-red-400 text-xs mt-2">Code incorrect</p>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Upload photos
  if (done) {
    return (
      <div className="text-center py-6">
        <Check size={24} style={{ color: accentColor }} className="mx-auto mb-2" />
        <p className="text-cream/80 text-sm">Photos ajoutees avec succes !</p>
        <button
          onClick={() => { setDone(false); }}
          className="text-xs mt-2"
          style={{ color: accentColor }}
        >
          Ajouter d&apos;autres photos
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <p className="text-cream/70 text-sm mb-1">Ajoutez vos photos et souvenirs</p>
        <p className="text-cream/40 text-xs mb-4">Chaque photo peut avoir une legende et etre liee a un moment de la ceremonie</p>
        <input
          type="text"
          value={addedByName}
          onChange={(e) => setAddedByName(e.target.value)}
          placeholder="Votre nom (pour identifier vos photos)"
          className="max-w-xs mx-auto w-full px-4 py-2.5 text-sm text-center border bg-transparent text-cream focus:outline-none"
          style={{ borderColor: `${accentColor}30` }}
        />
      </div>

      {/* File picker */}
      <div className="text-center mb-6">
        <label
          className="inline-flex items-center gap-2 px-6 py-3 border cursor-pointer text-sm transition-all hover:bg-white/5"
          style={{ borderColor: `${accentColor}50`, color: accentColor }}
        >
          <Upload size={16} />
          Choisir des photos
          <input type="file" accept="image/*" multiple onChange={handleFilesSelect} className="hidden" />
        </label>
      </div>

      {/* Preview files */}
      {files.length > 0 && (
        <div className="space-y-3 mb-6">
          {files.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 border" style={{ borderColor: `${accentColor}15` }}>
              <div className="relative w-16 h-16 shrink-0">
                <Image src={item.preview} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={item.caption}
                  onChange={(e) => updateFile(i, "caption", e.target.value)}
                  placeholder="Legende (ex: Photo de la ceremonie)"
                  className="w-full px-3 py-1.5 text-xs bg-transparent border text-cream focus:outline-none"
                  style={{ borderColor: `${accentColor}20` }}
                />
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={item.tag}
                    onChange={(e) => updateFile(i, "tag", e.target.value)}
                    className="px-3 py-1.5 text-xs bg-transparent border text-cream focus:outline-none"
                    style={{ borderColor: `${accentColor}20` }}
                  >
                    {MEDIA_TAGS.map((t) => (
                      <option key={t.value} value={t.value} className="text-charcoal">{t.label}</option>
                    ))}
                  </select>
                  {programmeEvents && programmeEvents.length > 0 && (
                    <select
                      value={item.eventId}
                      onChange={(e) => updateFile(i, "eventId", e.target.value)}
                      className="px-3 py-1.5 text-xs bg-transparent border text-cream focus:outline-none flex-1 min-w-0"
                      style={{ borderColor: `${accentColor}20` }}
                    >
                      <option value="" className="text-charcoal">Moment (optionnel)</option>
                      {programmeEvents.map((evt) => (
                        <option key={evt.id} value={evt.id} className="text-charcoal">{evt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <button onClick={() => removeFile(i)} className="text-red-400/50 hover:text-red-400 p-1 shrink-0">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {uploading ? (
              <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</>
            ) : (
              <><Upload size={16} /> Envoyer {files.length} photo(s)</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
