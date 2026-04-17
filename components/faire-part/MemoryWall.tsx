"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, MapPin, ChevronDown, Loader2 } from "lucide-react";
import type { Condolence } from "@/lib/types";
import { LIEN_OPTIONS } from "@/lib/types";

interface MemoryWallProps {
  condolences: Condolence[];
  loading: boolean;
  isFunerailles: boolean;
  accentColor: string;
  primaryColor: string;
  onSubmit: (data: { auteur: string; lien: string; message: string; ville: string }) => Promise<void>;
}

export default function MemoryWall({
  condolences,
  loading,
  isFunerailles,
  accentColor,
  primaryColor,
  onSubmit,
}: MemoryWallProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ auteur: "", lien: "", message: "", ville: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? condolences : condolences.slice(0, 6);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.auteur.trim() || !form.message.trim()) return;
    setSending(true);
    try {
      await onSubmit(form);
      setSent(true);
      setShowForm(false);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  const inputStyles = "w-full px-4 py-3 text-sm border bg-transparent text-cream focus:outline-none placeholder:text-cream/20";

  return (
    <div>
      {/* Write button */}
      {!sent && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 border text-sm transition-all hover:bg-white/5"
            style={{ borderColor: `${accentColor}50`, color: accentColor }}
          >
            <MessageCircle size={16} />
            {isFunerailles ? "Ecrire un message de condoleances" : "Laisser un message"}
            <ChevronDown size={14} className={`transition-transform ${showForm ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && !sent && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-10"
            onSubmit={handleSubmit}
          >
            <div className="border p-5 sm:p-6 space-y-4" style={{ borderColor: `${accentColor}20` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.auteur}
                  onChange={(e) => setForm((p) => ({ ...p, auteur: e.target.value }))}
                  placeholder="Votre nom *"
                  className={inputStyles}
                  style={{ borderColor: `${accentColor}20` }}
                  required
                />
                <select
                  value={form.lien}
                  onChange={(e) => setForm((p) => ({ ...p, lien: e.target.value }))}
                  className={inputStyles}
                  style={{ borderColor: `${accentColor}20` }}
                >
                  <option value="" className="text-charcoal">Votre lien...</option>
                  {LIEN_OPTIONS.map((l) => <option key={l} value={l} className="text-charcoal">{l}</option>)}
                </select>
              </div>
              <input
                type="text"
                value={form.ville}
                onChange={(e) => setForm((p) => ({ ...p, ville: e.target.value }))}
                placeholder="Votre ville (optionnel)"
                className={inputStyles}
                style={{ borderColor: `${accentColor}20` }}
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder={isFunerailles ? "Partagez un souvenir, un mot de reconfort..." : "Votre message de felicitations..."}
                rows={4}
                className={`${inputStyles} resize-none`}
                style={{ borderColor: `${accentColor}20` }}
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-3 text-sm text-white transition-all disabled:opacity-50"
                style={{ backgroundColor: accentColor }}
              >
                {sending ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                {sending ? "Envoi..." : "Publier mon message"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {sent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4 mb-8 border"
          style={{ borderColor: `${accentColor}20` }}
        >
          <p className="text-cream text-sm">Merci pour votre message.</p>
        </motion.div>
      )}

      {/* Messages wall */}
      {loading ? (
        <p className="text-cream/30 text-sm text-center py-8">Chargement...</p>
      ) : condolences.length === 0 ? (
        <p className="text-cream/30 text-sm text-center py-8 italic">
          Soyez le premier a laisser un message.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {displayed.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border p-5 relative overflow-hidden group"
                  style={{ borderColor: `${accentColor}15` }}
                >
                  {/* Decorative quote mark */}
                  <span
                    className="absolute -top-2 -left-1 font-heading text-6xl leading-none opacity-[0.06]"
                    style={{ color: accentColor }}
                  >
                    &ldquo;
                  </span>

                  <p className="text-cream/75 text-sm leading-relaxed relative z-10">
                    {c.message}
                  </p>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t relative z-10" style={{ borderColor: `${accentColor}10` }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    >
                      {c.auteur.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: accentColor }}>
                        {c.auteur}
                      </p>
                      <div className="flex items-center gap-1.5 text-cream/30 text-[10px]">
                        {c.lien && <span>{c.lien}</span>}
                        {c.ville && (
                          <>
                            <span>&middot;</span>
                            <MapPin size={8} />
                            <span>{c.ville}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show more */}
          {condolences.length > 6 && !showAll && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(true)}
                className="text-xs transition-colors"
                style={{ color: `${accentColor}80` }}
              >
                Voir les {condolences.length - 6} autres messages
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
