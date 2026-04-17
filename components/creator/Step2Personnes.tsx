"use client";

import { Plus, Trash2 } from "lucide-react";
import type { PersonneConcernee, EventType } from "@/lib/types";
import { TITRES_HONORIFIQUES } from "@/lib/types";
import { createEmptyPerson } from "@/lib/creator-helpers";

interface Step2Props {
  eventType: EventType;
  personnes: PersonneConcernee[];
  onChange: (personnes: PersonneConcernee[]) => void;
  sousTitre: string;
  onChangeSousTitre: (v: string) => void;
  epitaphe: string;
  onChangeEpitaphe: (v: string) => void;
  versetBiblique: string;
  onChangeVerset: (v: string) => void;
}

const inputStyles = "w-full px-3 py-2.5 bg-cream border border-border text-charcoal text-sm focus:outline-none focus:border-accent transition-colors";
const labelStyles = "block text-xs text-muted mb-1.5";

export default function Step2Personnes({
  eventType,
  personnes,
  onChange,
  sousTitre,
  onChangeSousTitre,
  epitaphe,
  onChangeEpitaphe,
  versetBiblique,
  onChangeVerset,
}: Step2Props) {
  const isFunerailles = eventType === "funerailles" || eventType === "levee-de-deuil";
  const isMariage = eventType.startsWith("mariage");

  function updatePerson(index: number, field: keyof PersonneConcernee, value: string | string[] | number | undefined) {
    const updated = [...personnes];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function addPerson() {
    onChange([...personnes, createEmptyPerson()]);
  }

  function removePerson(index: number) {
    if (personnes.length <= 1) return;
    onChange(personnes.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-8">
      {/* Verset */}
      <div>
        <label className={labelStyles}>Verset biblique ou formule d&apos;ouverture (optionnel)</label>
        <input
          type="text"
          value={versetBiblique}
          onChange={(e) => onChangeVerset(e.target.value)}
          className={inputStyles}
          placeholder='Ex: "Je suis la resurrection et la vie" - Jean 11:25'
        />
      </div>

      {/* Persons */}
      {personnes.map((p, index) => (
        <div key={index} className="border border-border p-4 sm:p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading text-lg text-charcoal">
              {isMariage
                ? index === 0
                  ? "Le marie"
                  : "La mariee"
                : eventType === "bapteme"
                  ? "L'enfant"
                  : "Le defunt"}
            </h4>
            {personnes.length > 1 && (
              <button onClick={() => removePerson(index)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Nom de famille *</label>
              <input type="text" value={p.nom} onChange={(e) => updatePerson(index, "nom", e.target.value)} className={inputStyles} placeholder="Tchinda" />
            </div>
            <div>
              <label className={labelStyles}>Prenoms *</label>
              <input type="text" value={p.prenoms} onChange={(e) => updatePerson(index, "prenoms", e.target.value)} className={inputStyles} placeholder="Jean Pierre" />
            </div>
            <div>
              <label className={labelStyles}>Titre honorifique</label>
              <select value={p.titreHonorifique || ""} onChange={(e) => updatePerson(index, "titreHonorifique", e.target.value || undefined)} className={inputStyles}>
                <option value="">Aucun</option>
                {TITRES_HONORIFIQUES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyles}>Surnom / Nom traditionnel</label>
              <input type="text" value={p.surnom || ""} onChange={(e) => updatePerson(index, "surnom", e.target.value || undefined)} className={inputStyles} placeholder='Ex: "Le Sage de Foto"' />
            </div>

            {isFunerailles && (
              <>
                <div>
                  <label className={labelStyles}>Date de naissance</label>
                  <input type="text" value={p.dateNaissance || ""} onChange={(e) => updatePerson(index, "dateNaissance", e.target.value)} className={inputStyles} placeholder="12 mars 1945" />
                </div>
                <div>
                  <label className={labelStyles}>Lieu de naissance</label>
                  <input type="text" value={p.lieuNaissance || ""} onChange={(e) => updatePerson(index, "lieuNaissance", e.target.value)} className={inputStyles} placeholder="Foto, Dschang" />
                </div>
                <div>
                  <label className={labelStyles}>Date de deces</label>
                  <input type="text" value={p.dateDeces || ""} onChange={(e) => updatePerson(index, "dateDeces", e.target.value)} className={inputStyles} placeholder="8 avril 2026" />
                </div>
                <div>
                  <label className={labelStyles}>Lieu de deces</label>
                  <input type="text" value={p.lieuDeces || ""} onChange={(e) => updatePerson(index, "lieuDeces", e.target.value)} className={inputStyles} placeholder="Hopital de district de Dschang" />
                </div>
                <div>
                  <label className={labelStyles}>Age au deces</label>
                  <input type="number" value={p.ageAuDeces || ""} onChange={(e) => updatePerson(index, "ageAuDeces", e.target.value ? parseInt(e.target.value) : undefined)} className={inputStyles} placeholder="81" />
                </div>
                <div>
                  <label className={labelStyles}>Mention cause du deces (optionnel)</label>
                  <input type="text" value={p.causeDecesMention || ""} onChange={(e) => updatePerson(index, "causeDecesMention", e.target.value || undefined)} className={inputStyles} placeholder="des suites d'une courte maladie" />
                </div>
              </>
            )}

            <div>
              <label className={labelStyles}>Profession</label>
              <input type="text" value={p.profession || ""} onChange={(e) => updatePerson(index, "profession", e.target.value || undefined)} className={inputStyles} placeholder="Enseignant a la retraite" />
            </div>
            <div>
              <label className={labelStyles}>Grade / Fonction officielle</label>
              <input type="text" value={p.gradeOuFonction || ""} onChange={(e) => updatePerson(index, "gradeOuFonction", e.target.value || undefined)} className={inputStyles} placeholder='Ex: "Colonel (ER)", "Ancien Prefet de..."' />
            </div>
            <div>
              <label className={labelStyles}>Titre traditionnel</label>
              <input type="text" value={p.titreTradi || ""} onChange={(e) => updatePerson(index, "titreTradi", e.target.value || undefined)} className={inputStyles} placeholder="Notable du groupement Foto - 7 cranes" />
            </div>
            <div>
              <label className={labelStyles}>Village d&apos;origine</label>
              <input type="text" value={p.villageOrigine || ""} onChange={(e) => updatePerson(index, "villageOrigine", e.target.value || undefined)} className={inputStyles} placeholder="Foto" />
            </div>
            <div>
              <label className={labelStyles}>Chefferie / Groupement</label>
              <input type="text" value={p.chefferie || ""} onChange={(e) => updatePerson(index, "chefferie", e.target.value || undefined)} className={inputStyles} placeholder="Groupement Foto" />
            </div>
            <div>
              <label className={labelStyles}>Decorations (separees par des virgules)</label>
              <input type="text" value={(p.decorations || []).join(", ")} onChange={(e) => updatePerson(index, "decorations", e.target.value ? e.target.value.split(",").map((s) => s.trim()) : undefined)} className={inputStyles} placeholder="Chevalier de l'Ordre de la Valeur" />
            </div>
          </div>
        </div>
      ))}

      {isMariage && personnes.length < 2 && (
        <button onClick={addPerson} className="flex items-center gap-2 text-sm text-accent hover:text-accent-dark">
          <Plus size={16} /> Ajouter la/le marie(e)
        </button>
      )}

      {/* Sous-titre / Annonce */}
      <div>
        <label className={labelStyles}>
          {isFunerailles ? "Formule d'annonce" : "Message d'invitation"} *
        </label>
        <textarea
          value={sousTitre}
          onChange={(e) => onChangeSousTitre(e.target.value)}
          rows={4}
          className={`${inputStyles} resize-none`}
          placeholder={
            isFunerailles
              ? "La grande famille X, les enfants, petits-enfants... ont la profonde douleur de vous annoncer le deces de leur..."
              : "Les familles X et Y ont le plaisir de vous inviter au mariage de leurs enfants..."
          }
        />
      </div>

      {/* Epitaphe */}
      <div>
        <label className={labelStyles}>
          {isFunerailles ? "Epitaphe / Hommage" : "Citation"} (optionnel)
        </label>
        <textarea
          value={epitaphe}
          onChange={(e) => onChangeEpitaphe(e.target.value)}
          rows={2}
          className={`${inputStyles} resize-none`}
          placeholder="Un homme de coeur, un pilier de sa famille..."
        />
      </div>
    </div>
  );
}
