"use client";

import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FamilleGroupe, FamilleMembre, FamilleCategorie, EventType } from "@/lib/types";
import { FAMILLE_CATEGORIES } from "@/lib/types";

interface Step3Props {
  eventType: EventType;
  famille: FamilleGroupe[];
  onChange: (famille: FamilleGroupe[]) => void;
  familleName: string;
  onChangeFamilleName: (v: string) => void;
}

const inputStyles = "w-full px-3 py-2.5 bg-cream border border-border text-charcoal text-sm focus:outline-none focus:border-accent transition-colors";
const labelStyles = "block text-xs text-muted mb-1.5";

function MembreRow({
  membre,
  onChange,
  onRemove,
}: {
  membre: FamilleMembre;
  onChange: (m: FamilleMembre) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-border/50 last:border-0">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input
          type="text"
          value={membre.nom}
          onChange={(e) => onChange({ ...membre, nom: e.target.value })}
          className={`${inputStyles} sm:col-span-1`}
          placeholder="Nom complet *"
        />
        <input
          type="text"
          value={membre.conjoint || ""}
          onChange={(e) => onChange({ ...membre, conjoint: e.target.value || undefined })}
          className={inputStyles}
          placeholder="epse / et epouse"
        />
        <input
          type="text"
          value={membre.villeResidence || ""}
          onChange={(e) => onChange({ ...membre, villeResidence: e.target.value || undefined })}
          className={inputStyles}
          placeholder="Ville, Pays"
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={membre.mention || ""}
            onChange={(e) => onChange({ ...membre, mention: e.target.value || undefined })}
            className={`${inputStyles} flex-1`}
            placeholder="(Aine), et famille..."
          />
          <label className="flex items-center gap-1 text-xs text-muted shrink-0 cursor-pointer" title="Decede(e)">
            <input
              type="checkbox"
              checked={membre.estDecede || false}
              onChange={(e) => onChange({ ...membre, estDecede: e.target.checked || undefined })}
              className="accent-accent"
            />
            Feu
          </label>
        </div>
      </div>
      <button onClick={onRemove} className="text-red-300 hover:text-red-500 p-1 mt-1 shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function GroupeCard({
  groupe,
  index,
  eventType,
  onChange,
  onRemove,
}: {
  groupe: FamilleGroupe;
  index: number;
  eventType: EventType;
  onChange: (g: FamilleGroupe) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const isMariage = eventType.startsWith("mariage");
  const filteredCategories = FAMILLE_CATEGORIES.filter(
    (c) => !c.forTypes || c.forTypes.includes(eventType)
  );

  function addMembre() {
    onChange({
      ...groupe,
      membres: [...groupe.membres, { nom: "" }],
    });
  }

  function updateMembre(i: number, m: FamilleMembre) {
    const updated = [...groupe.membres];
    updated[i] = m;
    onChange({ ...groupe, membres: updated });
  }

  function removeMembre(i: number) {
    onChange({ ...groupe, membres: groupe.membres.filter((_, j) => j !== i) });
  }

  const catLabel = FAMILLE_CATEGORIES.find((c) => c.value === groupe.categorie)?.label || groupe.categorie;

  return (
    <div className="border border-border bg-white">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-cream/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <ChevronDown size={16} className={`text-muted transition-transform ${expanded ? "rotate-180" : ""}`} />
          <span className="text-sm font-medium text-charcoal">{catLabel}</span>
          <span className="text-xs text-muted">({groupe.membres.length})</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="text-red-300 hover:text-red-500 p-1"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelStyles}>Categorie</label>
              <select
                value={groupe.categorie}
                onChange={(e) => onChange({ ...groupe, categorie: e.target.value as FamilleCategorie })}
                className={inputStyles}
              >
                {filteredCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            {isMariage && (
              <div>
                <label className={labelStyles}>Cote famille</label>
                <select
                  value={groupe.coteFamille || "commun"}
                  onChange={(e) => onChange({ ...groupe, coteFamille: e.target.value as FamilleGroupe["coteFamille"] })}
                  className={inputStyles}
                >
                  <option value="commun">Commun</option>
                  <option value="marie">Cote marie</option>
                  <option value="mariee">Cote mariee</option>
                </select>
              </div>
            )}
            {groupe.categorie === "autre" && (
              <div>
                <label className={labelStyles}>Label personnalise</label>
                <input
                  type="text"
                  value={groupe.labelCustom || ""}
                  onChange={(e) => onChange({ ...groupe, labelCustom: e.target.value })}
                  className={inputStyles}
                  placeholder="Ex: Delegation du village"
                />
              </div>
            )}
          </div>

          {/* Membres header */}
          <div className="hidden sm:grid grid-cols-4 gap-2 text-[10px] text-muted uppercase tracking-wider px-1">
            <span>Nom complet</span>
            <span>Conjoint(e)</span>
            <span>Ville, Pays</span>
            <span>Mention</span>
          </div>

          {groupe.membres.map((m, i) => (
            <MembreRow
              key={i}
              membre={m}
              onChange={(updated) => updateMembre(i, updated)}
              onRemove={() => removeMembre(i)}
            />
          ))}

          <button
            onClick={addMembre}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-dark"
          >
            <Plus size={14} /> Ajouter un membre
          </button>
        </div>
      )}
    </div>
  );
}

export default function Step3Famille({
  eventType,
  famille,
  onChange,
  familleName,
  onChangeFamilleName,
}: Step3Props) {
  function addGroupe() {
    onChange([
      ...famille,
      { categorie: "enfants", membres: [{ nom: "" }] },
    ]);
  }

  function updateGroupe(index: number, g: FamilleGroupe) {
    const updated = [...famille];
    updated[index] = g;
    onChange(updated);
  }

  function removeGroupe(index: number) {
    onChange(famille.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div>
        <label className={labelStyles}>Nom de la famille *</label>
        <input
          type="text"
          value={familleName}
          onChange={(e) => onChangeFamilleName(e.target.value)}
          className={inputStyles}
          placeholder="Famille Tchinda / Familles Kamga & Fonkou"
        />
        <p className="text-[10px] text-muted mt-1">
          Ce nom apparaitra sur le faire-part et dans la liste des faire-parts.
        </p>
      </div>

      <div>
        <h3 className="font-heading text-lg text-charcoal mb-1">
          Groupes familiaux
        </h3>
        <p className="text-muted text-xs mb-4">
          Ajoutez les differents groupes de la famille. Pour chaque membre, indiquez la ville/pays de residence (important pour la diaspora). L&apos;ordre des groupes sera respecte sur le faire-part.
        </p>

        <div className="space-y-3">
          {famille.map((g, i) => (
            <GroupeCard
              key={i}
              groupe={g}
              index={i}
              eventType={eventType}
              onChange={(updated) => updateGroupe(i, updated)}
              onRemove={() => removeGroupe(i)}
            />
          ))}
        </div>

        <button
          onClick={addGroupe}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 border border-accent/30 text-accent text-sm hover:bg-accent/5 transition-colors"
        >
          <Plus size={16} /> Ajouter un groupe familial
        </button>
      </div>
    </div>
  );
}
