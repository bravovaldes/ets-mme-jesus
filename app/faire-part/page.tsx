"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getFaireParts } from "@/lib/fairepart-service";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import type { FairePartPage, EventType } from "@/lib/types";

export default function FairePartListPage() {
  const [items, setItems] = useState<FairePartPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<EventType | "all">("all");

  useEffect(() => {
    async function load() {
      const data = await getFaireParts(true);
      setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((fp) => {
      const matchesType = filterType === "all" || fp.eventType === filterType;
      if (!matchesType) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const mainPerson = fp.personnes?.[0];
      return (
        mainPerson?.nom?.toLowerCase().includes(q) ||
        mainPerson?.prenoms?.toLowerCase().includes(q) ||
        fp.familleName?.toLowerCase().includes(q) ||
        fp.ville?.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery, filterType]);

  return (
    <>
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-normal mb-6">
            Faire-parts &amp; Pages Hommage
          </h1>
          <p className="text-cream/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Funerailles, mariages, celebrations — chaque evenement merite
            un faire-part a la hauteur. Decouvrez les pages creees pour
            les familles que nous accompagnons.
          </p>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filter */}
          {!loading && items.length > 0 && (
            <div className="mb-8 space-y-4">
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, famille ou ville..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border text-sm text-charcoal focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              {/* Type filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {(["all", "funerailles", "mariage-traditionnel", "mariage-civil", "mariage-religieux", "levee-de-deuil", "bapteme"] as const).map((type) => {
                  const count = type === "all" ? items.length : items.filter((fp) => fp.eventType === type).length;
                  if (count === 0 && type !== "all") return null;
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-1.5 text-xs border transition-all ${
                        filterType === type
                          ? "bg-accent text-white border-accent"
                          : "bg-white text-charcoal border-border hover:border-accent/30"
                      }`}
                    >
                      {type === "all" ? "Tous" : EVENT_TYPE_LABELS[type]} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-muted text-center py-16">Chargement...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((fp, i) => {
                const mainPerson = fp.personnes[0];
                const secondPerson = fp.personnes[1];
                const isMariage = fp.eventType.startsWith("mariage");
                return (
                  <motion.div
                    key={fp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link
                      href={`/faire-part/${fp.slug}`}
                      className="group block border border-border bg-white overflow-hidden hover:border-accent/30 transition-all duration-500"
                    >
                      {/* Cover */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={mainPerson.photoPortrait}
                          alt={`${mainPerson.prenoms} ${mainPerson.nom}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[0.3] group-hover:grayscale-0"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Badge type */}
                        <div
                          className="absolute top-3 left-3 px-3 py-1 text-xs tracking-wider"
                          style={{
                            backgroundColor: fp.fairePartDesign.accentColor,
                            color: "white",
                          }}
                        >
                          {EVENT_TYPE_LABELS[fp.eventType]}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                          <p className="font-heading text-xl sm:text-2xl text-cream">
                            {mainPerson.prenoms} {mainPerson.nom}
                            {secondPerson && isMariage && (
                              <span className="text-cream/60">
                                {" "}
                                &amp; {secondPerson.prenoms}
                              </span>
                            )}
                          </p>
                          {mainPerson.dateNaissance && (
                            <p className="text-cream/50 text-xs mt-1">
                              {mainPerson.dateNaissance}
                              {mainPerson.dateDeces &&
                                ` — ${mainPerson.dateDeces}`}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-4 sm:p-5">
                        <p className="text-muted text-sm italic line-clamp-2">
                          {fp.epitaphe || fp.messageInvitation || fp.sousTitre}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted">
                            {fp.familleName} &middot; {fp.ville}
                          </span>
                          <span className="text-accent text-xs group-hover:translate-x-1 inline-block transition-transform duration-300">
                            Voir &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* No results */}
          {!loading && filtered.length === 0 && items.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted text-sm">Aucun faire-part ne correspond a votre recherche.</p>
              <button onClick={() => { setSearchQuery(""); setFilterType("all"); }} className="text-accent text-xs mt-2 hover:text-accent-dark">
                Effacer les filtres
              </button>
            </div>
          )}

          {!loading && items.length === 0 && (
            <p className="text-muted text-center py-12">Aucun faire-part publie pour le moment.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12 sm:py-16 print:hidden">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-xl sm:text-2xl text-charcoal mb-4">
            Creer un faire-part pour votre evenement
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Funerailles, mariage traditionnel, levee de deuil ou celebration —
            nous creons un faire-part digital premium a votre image, partageable
            sur WhatsApp et imprimable.
          </p>
          <a
            href="/contact?service=Faire-part%20digital"
            className="inline-block px-8 py-3 bg-accent text-white text-sm tracking-wide hover:bg-accent-dark transition-colors"
          >
            Demander un faire-part
          </a>
        </div>
      </section>
    </>
  );
}
