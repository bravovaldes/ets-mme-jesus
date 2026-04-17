"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getFairePartBySlug } from "@/lib/fairepart-service";
import type { FairePartPage } from "@/lib/types";
import FairePartContent from "@/components/faire-part/FairePartContent";

export default function FairePartSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [fp, setFp] = useState<FairePartPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getFairePartBySlug(slug);
      if (data) {
        setFp(data);
        // If no access code required, grant access immediately
        if (!data.accessCode) {
          setAccessGranted(true);
        }
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted text-sm">Chargement du faire-part...</p>
        </div>
      </div>
    );
  }

  if (notFound || !fp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
        <h1 className="font-heading text-3xl text-charcoal mb-4">
          Page introuvable
        </h1>
        <p className="text-muted mb-8 text-center">
          Ce faire-part n&apos;existe pas, a ete retire, ou est reserve aux
          personnes disposant du lien.
        </p>
        <a
          href="/faire-part"
          className="px-6 py-3 bg-accent text-white text-sm hover:bg-accent-dark transition-colors"
        >
          Voir tous les faire-parts
        </a>
      </div>
    );
  }

  // Access code gate
  if (fp.accessCode && !accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-sm w-full bg-white border border-border p-8 text-center">
          <h2 className="font-heading text-2xl text-charcoal mb-2">
            Page protegee
          </h2>
          <p className="text-muted text-sm mb-6">
            Cette page est reservee aux proches. Veuillez saisir le code
            d&apos;acces communique par la famille.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (accessCode === fp.accessCode) {
                setAccessGranted(true);
              } else {
                alert("Code incorrect");
              }
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Code d'acces"
              className="w-full px-4 py-3 bg-cream border border-border text-charcoal text-sm text-center tracking-widest focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="w-full py-3 bg-accent text-white text-sm hover:bg-accent-dark transition-colors"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <FairePartContent fp={fp} />;
}
