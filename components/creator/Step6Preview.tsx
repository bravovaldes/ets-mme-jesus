"use client";

import { useState } from "react";
import { Eye, Send, Loader2 } from "lucide-react";
import type { FairePartPage } from "@/lib/types";
import { EVENT_TYPE_LABELS } from "@/lib/types";

interface Step6Props {
  fairePart: Partial<FairePartPage>;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  submitted: boolean;
}

export default function Step6Preview({
  fairePart: fp,
  onSubmit,
  submitting,
  submitted,
}: Step6Props) {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const mainPerson = fp.personnes?.[0];
  const secondPerson = fp.personnes?.[1];
  const design = fp.fairePartDesign;

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl text-charcoal mb-4">
          Faire-part envoye !
        </h2>
        <p className="text-muted leading-relaxed max-w-md mx-auto mb-4">
          Votre faire-part a ete soumis pour approbation. Notre equipe le
          verifiera et le publiera dans les plus brefs delais.
        </p>
        <p className="text-muted text-sm">
          Vous serez contacte(e) par WhatsApp ou telephone une fois le
          faire-part approuve.
        </p>
      </div>
    );
  }

  // Validation
  const errors: string[] = [];
  if (!mainPerson?.nom || !mainPerson?.prenoms) errors.push("Renseignez le nom et prenom de la personne concernee");
  if (!fp.sousTitre) errors.push("Renseignez la formule d'annonce / message d'invitation");
  if (!fp.familleName) errors.push("Renseignez le nom de la famille");
  if (!fp.ville) errors.push("Renseignez la ville");
  if (!fp.contactsFamille || fp.contactsFamille.length === 0 || !fp.contactsFamille[0].telephone) {
    errors.push("Renseignez au moins un contact telephone");
  }

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-xl text-charcoal">
        Verifiez votre faire-part
      </h3>

      {/* Mini preview */}
      {design && (
        <div
          className="border-2 overflow-hidden"
          style={{ borderColor: design.accentColor }}
        >
          {/* Hero preview */}
          <div className="p-6 sm:p-8 text-center" style={{ backgroundColor: design.primaryColor }}>
            {fp.versetBiblique && (
              <p className="text-xs italic mb-3" style={{ color: `${design.accentColor}80` }}>
                {fp.versetBiblique}
              </p>
            )}
            <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: design.accentColor }}>
              {EVENT_TYPE_LABELS[fp.eventType!]}
            </p>
            <h2 className="font-heading text-xl sm:text-2xl text-cream mb-2">
              {fp.titre}
            </h2>
            {mainPerson && (
              <p className="font-heading text-lg text-cream/80">
                {mainPerson.titreHonorifique && `${mainPerson.titreHonorifique} `}
                {mainPerson.prenoms} {mainPerson.nom}
                {secondPerson && (
                  <span style={{ color: design.accentColor }}>
                    {" & "}{secondPerson.prenoms} {secondPerson.nom}
                  </span>
                )}
              </p>
            )}
            {mainPerson?.dateNaissance && (
              <p className="text-cream/40 text-xs mt-1">
                {mainPerson.dateNaissance}
                {mainPerson.dateDeces && ` — ${mainPerson.dateDeces}`}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="p-6" style={{ backgroundColor: design.backgroundColor }}>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted">Famille</span>
                <p style={{ color: design.primaryColor }}>{fp.familleName || "—"}</p>
              </div>
              <div>
                <span className="text-muted">Lieu</span>
                <p style={{ color: design.primaryColor }}>{fp.ville || "—"}, {fp.region}</p>
              </div>
              <div>
                <span className="text-muted">Programme</span>
                <p style={{ color: design.primaryColor }}>
                  {fp.programme?.length || 0} jour(s),{" "}
                  {fp.programme?.reduce((a, j) => a + j.evenements.length, 0) || 0} evenement(s)
                </p>
              </div>
              <div>
                <span className="text-muted">Famille</span>
                <p style={{ color: design.primaryColor }}>
                  {fp.famille?.length || 0} groupe(s),{" "}
                  {fp.famille?.reduce((a, g) => a + g.membres.length, 0) || 0} membre(s)
                </p>
              </div>
              <div>
                <span className="text-muted">Contacts</span>
                <p style={{ color: design.primaryColor }}>
                  {fp.contactsFamille?.filter((c) => c.telephone).length || 0} contact(s)
                </p>
              </div>
              <div>
                <span className="text-muted">Visibilite</span>
                <p style={{ color: design.primaryColor }}>
                  {fp.isPrivate ? "Prive (lien uniquement)" : "Public"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700 font-medium mb-2">
            Informations manquantes :
          </p>
          <ul className="space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-red-600 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">-</span>
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Note */}
      <div className="border border-accent/20 bg-accent/5 p-4">
        <p className="text-sm text-charcoal">
          Apres soumission, votre faire-part sera verifie par notre equipe
          avant publication. Vous pouvez toujours ajouter des photos et
          modifier les details apres approbation.
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={submitting || errors.length > 0}
        className={`w-full flex items-center justify-center gap-3 py-4 text-sm tracking-wide transition-all ${
          errors.length > 0
            ? "bg-muted/20 text-muted cursor-not-allowed"
            : "bg-accent text-white hover:bg-accent-dark"
        }`}
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={18} />
            Soumettre le faire-part pour approbation
          </>
        )}
      </button>
    </div>
  );
}
