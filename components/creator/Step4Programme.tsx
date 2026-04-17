"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ProgrammeJour, ProgrammeEvenement, EventType } from "@/lib/types";
import { createEmptyJour } from "@/lib/creator-helpers";

interface Step4Props {
  eventType: EventType;
  programme: ProgrammeJour[];
  onChange: (programme: ProgrammeJour[]) => void;
  biographie: string;
  onChangeBiographie: (v: string) => void;
}

const inputStyles = "w-full px-3 py-2.5 bg-cream border border-border text-charcoal text-sm focus:outline-none focus:border-accent transition-colors";
const labelStyles = "block text-xs text-muted mb-1.5";

export default function Step4Programme({
  eventType,
  programme,
  onChange,
  biographie,
  onChangeBiographie,
}: Step4Props) {
  const isFunerailles = eventType === "funerailles" || eventType === "levee-de-deuil";

  function addJour() {
    onChange([...programme, createEmptyJour()]);
  }

  function removeJour(index: number) {
    if (programme.length <= 1) return;
    onChange(programme.filter((_, i) => i !== index));
  }

  function updateJour(index: number, field: keyof ProgrammeJour, value: string) {
    const updated = [...programme];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function addEvenement(jourIndex: number) {
    const updated = [...programme];
    updated[jourIndex].evenements.push({ heure: "", titre: "", lieu: "" });
    onChange(updated);
  }

  function removeEvenement(jourIndex: number, evtIndex: number) {
    const updated = [...programme];
    updated[jourIndex].evenements = updated[jourIndex].evenements.filter((_, i) => i !== evtIndex);
    onChange(updated);
  }

  function updateEvenement(jourIndex: number, evtIndex: number, field: keyof ProgrammeEvenement, value: string) {
    const updated = [...programme];
    updated[jourIndex] = {
      ...updated[jourIndex],
      evenements: updated[jourIndex].evenements.map((evt, i) =>
        i === evtIndex ? { ...evt, [field]: value } : evt
      ),
    };
    onChange(updated);
  }

  return (
    <div className="space-y-8">
      {/* Biographie */}
      <div>
        <label className={labelStyles}>
          {isFunerailles ? "Biographie du defunt" : "Votre histoire"} (optionnel)
        </label>
        <textarea
          value={biographie}
          onChange={(e) => onChangeBiographie(e.target.value)}
          rows={6}
          className={`${inputStyles} resize-y`}
          placeholder={
            isFunerailles
              ? "Ne(e) a... le... Diplome de... Epoux/epouse de... Pere/mere de... Il/elle a consacre sa vie a..."
              : "Nous nous sommes rencontres en... Notre histoire..."
          }
        />
      </div>

      {/* Programme */}
      <div>
        <h3 className="font-heading text-lg text-charcoal mb-1">
          Programme de l&apos;evenement
        </h3>
        <p className="text-muted text-xs mb-4">
          Ajoutez chaque journee et ses evenements dans l&apos;ordre chronologique.
        </p>

        <div className="space-y-6">
          {programme.map((jour, ji) => (
            <div key={jour.id} className="border border-border bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 mr-4">
                  <label className={labelStyles}>Jour / Date</label>
                  <input
                    type="text"
                    value={jour.jour}
                    onChange={(e) => updateJour(ji, "jour", e.target.value)}
                    className={inputStyles}
                    placeholder="Vendredi 15 avril 2026"
                  />
                </div>
                {programme.length > 1 && (
                  <button onClick={() => removeJour(ji)} className="text-red-300 hover:text-red-500 p-1 mt-4">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {jour.evenements.map((evt, ei) => (
                  <div key={ei} className="grid grid-cols-12 gap-2 items-start border-b border-border/30 pb-3 last:border-0">
                    <div className="col-span-3 sm:col-span-2">
                      <input
                        type="text"
                        value={evt.heure}
                        onChange={(e) => updateEvenement(ji, ei, "heure", e.target.value)}
                        className={inputStyles}
                        placeholder="09h00"
                      />
                    </div>
                    <div className="col-span-8 sm:col-span-4">
                      <input
                        type="text"
                        value={evt.titre}
                        onChange={(e) => updateEvenement(ji, ei, "titre", e.target.value)}
                        className={inputStyles}
                        placeholder="Messe de requiem"
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <input
                        type="text"
                        value={evt.lieu}
                        onChange={(e) => updateEvenement(ji, ei, "lieu", e.target.value)}
                        className={inputStyles}
                        placeholder="Eglise Saint-Joseph"
                      />
                    </div>
                    <div className="col-span-11 sm:col-span-2">
                      <input
                        type="text"
                        value={evt.description || ""}
                        onChange={(e) => updateEvenement(ji, ei, "description", e.target.value)}
                        className={inputStyles}
                        placeholder="Description (optionnel)"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => removeEvenement(ji, ei)} className="text-red-300 hover:text-red-500 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addEvenement(ji)}
                  className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-dark"
                >
                  <Plus size={14} /> Ajouter un evenement
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addJour}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 border border-accent/30 text-accent text-sm hover:bg-accent/5 transition-colors"
        >
          <Plus size={16} /> Ajouter une journee
        </button>
      </div>
    </div>
  );
}
