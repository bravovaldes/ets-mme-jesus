"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FairePartPage } from "@/lib/types";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import { Check, X, Eye, Trash2, Lock, Globe } from "lucide-react";

const ADMIN_PASSWORD = "etsmmejesus2026";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [faireParts, setFaireParts] = useState<(FairePartPage & { docId: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "published">("all");

  async function loadData() {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "faireParts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((d) => ({
        ...d.data(),
        docId: d.id,
        id: d.id,
      })) as (FairePartPage & { docId: string })[];
      setFaireParts(items);
    } catch (err) {
      console.error("Error loading:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated]);

  async function handleApprove(docId: string) {
    if (!db) return;
    await updateDoc(doc(db, "faireParts", docId), {
      isPublished: true,
      isPending: false,
    });
    loadData();
  }

  async function handleReject(docId: string) {
    if (!db) return;
    await updateDoc(doc(db, "faireParts", docId), {
      isPending: false,
      isPublished: false,
    });
    loadData();
  }

  async function handleDelete(docId: string) {
    if (!db) return;
    if (!confirm("Supprimer definitivement ce faire-part ?")) return;
    await deleteDoc(doc(db, "faireParts", docId));
    loadData();
  }

  async function handleTogglePublish(docId: string, current: boolean) {
    if (!db) return;
    await updateDoc(doc(db, "faireParts", docId), {
      isPublished: !current,
    });
    loadData();
  }

  // Auth gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-border p-8">
          <h1 className="font-heading text-2xl text-charcoal mb-2 text-center">
            Administration
          </h1>
          <p className="text-muted text-sm mb-6 text-center">
            ETS Mme Jesus — Panel admin
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === ADMIN_PASSWORD) {
                setAuthenticated(true);
              } else {
                alert("Mot de passe incorrect");
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cream border border-border text-charcoal text-sm focus:outline-none focus:border-accent transition-colors"
              placeholder="Mot de passe admin"
            />
            <button
              type="submit"
              className="w-full py-3 bg-primary text-cream text-sm hover:bg-primary-light transition-colors"
            >
              Connexion
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filtered = faireParts.filter((fp) => {
    if (filter === "pending") return fp.isPending;
    if (filter === "published") return fp.isPublished;
    return true;
  });

  const pendingCount = faireParts.filter((fp) => fp.isPending).length;

  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-primary pt-28 sm:pt-32 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl sm:text-3xl text-cream">
            Panel Admin
          </h1>
          <p className="text-cream/50 text-sm mt-1">
            {faireParts.length} faire-part(s) au total
            {pendingCount > 0 && (
              <span className="text-accent ml-2">
                — {pendingCount} en attente d&apos;approbation
              </span>
            )}
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {(["all", "pending", "published"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs border transition-colors ${
                  filter === f
                    ? "bg-accent text-white border-accent"
                    : "border-border text-charcoal hover:border-accent/30"
                }`}
              >
                {f === "all" ? "Tous" : f === "pending" ? "En attente" : "Publies"}
                {f === "pending" && pendingCount > 0 && (
                  <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-muted py-8 text-center">Chargement...</p>
          ) : !db ? (
            <div className="text-center py-12 bg-white border border-border p-8">
              <p className="text-charcoal font-heading text-lg mb-2">Firebase non configure</p>
              <p className="text-muted text-sm">Creez la base de donnees Firestore dans la console Firebase pour voir les faire-parts soumis.</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted py-8 text-center">Aucun faire-part{filter !== "all" ? ` ${filter === "pending" ? "en attente" : "publie"}` : ""}.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((fp) => {
                const mainPerson = fp.personnes?.[0];
                return (
                  <div
                    key={fp.docId}
                    className={`bg-white border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                      fp.isPending ? "border-accent/50" : "border-border"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary">
                          {EVENT_TYPE_LABELS[fp.eventType]}
                        </span>
                        {fp.isPending && (
                          <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700">
                            En attente
                          </span>
                        )}
                        {fp.isPublished && (
                          <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700">
                            Publie
                          </span>
                        )}
                        {fp.isPrivate && (
                          <Lock size={12} className="text-muted" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-charcoal mt-1 truncate">
                        {mainPerson?.titreHonorifique && `${mainPerson.titreHonorifique} `}
                        {mainPerson?.prenoms} {mainPerson?.nom}
                      </p>
                      <p className="text-xs text-muted">
                        {fp.familleName} — {fp.ville}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/faire-part/${fp.slug || fp.docId}`}
                        target="_blank"
                        className="p-2 border border-border text-muted hover:text-accent hover:border-accent/30 transition-colors"
                        title="Voir"
                      >
                        <Eye size={16} />
                      </a>
                      {fp.isPending && (
                        <>
                          <button
                            onClick={() => handleApprove(fp.docId)}
                            className="p-2 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                            title="Approuver"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(fp.docId)}
                            className="p-2 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
                            title="Rejeter"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {!fp.isPending && (
                        <button
                          onClick={() => handleTogglePublish(fp.docId, fp.isPublished)}
                          className="p-2 border border-border text-muted hover:text-accent hover:border-accent/30 transition-colors"
                          title={fp.isPublished ? "Depublier" : "Publier"}
                        >
                          {fp.isPublished ? <Globe size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(fp.docId)}
                        className="p-2 border border-border text-red-300 hover:text-red-500 hover:border-red-200 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
