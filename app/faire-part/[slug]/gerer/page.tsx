"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { getFairePartBySlug } from "@/lib/fairepart-service";
import type { FairePartPage, PhotoItem } from "@/lib/types";
import { Upload, Trash2, Download, GripVertical, Save, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GererFairePartPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [fp, setFp] = useState<FairePartPage | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getFairePartBySlug(slug);
      if (data) {
        setFp(data);
        setPhotos(data.photos || []);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !storage) return;

    setUploading(true);
    const newPhotos: PhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const storageRef = ref(storage, `faire-parts/${slug}/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        newPhotos.push({
          id: `photo-${Date.now()}-${i}`,
          type: "photo" as const,
          url,
          caption: "",
          isDownloadable: true,
          isCover: false,
          isRecap: false,
          order: photos.length + i,
        });
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setUploading(false);
    e.target.value = "";
  }

  function updatePhoto(id: string, field: keyof PhotoItem, value: string | boolean | number) {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setSaved(false);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setSaved(false);
  }

  async function handleSave() {
    if (!db || !fp) return;
    setSaving(true);
    try {
      const docRef = doc(db, "faireParts", fp.id);
      await updateDoc(docRef, {
        photos: photos.map((p, i) => ({ ...p, order: i })),
      });
      setSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  if (!fp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
        <h1 className="font-heading text-2xl text-charcoal mb-4">Faire-part introuvable</h1>
        <a href="/faire-part" className="text-accent text-sm">Retour aux faire-parts</a>
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary pt-28 sm:pt-32 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/faire-part/${slug}`} className="inline-flex items-center gap-2 text-cream/50 text-xs hover:text-cream mb-4 transition-colors">
            <ArrowLeft size={14} /> Retour au faire-part
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl text-cream">
            Gerer les photos
          </h1>
          <p className="text-cream/60 text-sm mt-1">
            {fp.personnes[0]?.prenoms} {fp.personnes[0]?.nom} &mdash; {fp.familleName}
          </p>
        </div>
      </section>

      <section className="bg-cream py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Upload */}
          <div className="bg-white border border-dashed border-accent/30 p-8 text-center mb-8">
            <Upload size={32} className="text-accent/40 mx-auto mb-3" />
            <p className="text-sm text-charcoal mb-1">
              Ajoutez les photos de la ceremonie
            </p>
            <p className="text-xs text-muted mb-4">
              JPG, PNG ou WebP. Plusieurs fichiers a la fois possibles.
            </p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm hover:bg-accent-dark transition-colors">
              <Upload size={16} />
              {uploading ? "Envoi en cours..." : "Choisir des photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Photos list */}
          {photos.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">Aucune photo pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="bg-white border border-border p-3 flex items-start gap-4"
                >
                  <GripVertical size={16} className="text-muted/30 mt-4 shrink-0 cursor-grab" />

                  {/* Thumbnail */}
                  <div className="relative w-20 h-16 shrink-0 bg-cream">
                    <Image
                      src={photo.url}
                      alt={photo.caption || `Photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={photo.caption || ""}
                      onChange={(e) => updatePhoto(photo.id, "caption", e.target.value)}
                      placeholder="Legende (ex: Vue de la reception)"
                      className="w-full px-3 py-2 bg-cream border border-border text-sm focus:outline-none focus:border-accent text-charcoal"
                    />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                        <input
                          type="checkbox"
                          checked={photo.isDownloadable}
                          onChange={(e) => updatePhoto(photo.id, "isDownloadable", e.target.checked)}
                          className="accent-accent"
                        />
                        <Download size={12} /> Telechargeable
                      </label>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="text-red-300 hover:text-red-500 p-2 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save */}
          {photos.length > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <><Save size={16} className="animate-pulse" /> Sauvegarde...</>
                ) : saved ? (
                  <><Check size={16} /> Sauvegarde !</>
                ) : (
                  <><Save size={16} /> Sauvegarder les photos</>
                )}
              </button>
              <p className="text-xs text-muted">
                {photos.length} photo(s) &mdash; Les photos apparaitront sur le faire-part apres sauvegarde.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
