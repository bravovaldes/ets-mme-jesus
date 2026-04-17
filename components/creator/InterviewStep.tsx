"use client";

import { useState } from "react";
import { Upload, User, Camera } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import type { EventType } from "@/lib/types";
import { EVENT_TYPE_LABELS, TITRES_HONORIFIQUES, REGIONS_CAMEROUN } from "@/lib/types";

export interface InterviewAnswers {
  eventType: EventType;
  sexe: "homme" | "femme";
  nom: string;
  prenoms: string;
  titreHonorifique: string;
  dateNaissance: string;
  dateDeces: string;
  lieuNaissance: string;
  lieuDeces: string;
  profession: string;
  titreTradi: string;
  village: string;
  conjoint: string;
  surnom: string;
  causeDecesMention: string;
  decorations: string;
  chefferie: string;
  nbEnfants: string;
  ville: string;
  region: string;
  eglise: string;
  symboleReligieux: string;
  description: string; // quelques phrases libres de l'utilisateur
  photoPortrait: string;
  // Mariage
  sexe2?: "homme" | "femme";
  nom2?: string;
  prenoms2?: string;
  profession2?: string;
  village2?: string;
  photoPortrait2?: string;
}

interface InterviewStepProps {
  answers: InterviewAnswers;
  onChange: (answers: InterviewAnswers) => void;
  onNext: () => void;
}

const inputStyles = "w-full px-4 py-3 bg-cream border border-border text-charcoal text-sm focus:outline-none focus:border-accent transition-colors";
const labelStyles = "block text-xs font-medium text-charcoal mb-1.5";

export default function InterviewStep({ answers, onChange, onNext }: InterviewStepProps) {
  const [uploadingPhoto, setUploadingPhoto] = useState<1 | 2 | null>(null);

  const isFunerailles = answers.eventType === "funerailles" || answers.eventType === "levee-de-deuil";
  const isMariage = answers.eventType.startsWith("mariage");

  function set(field: keyof InterviewAnswers, value: string) {
    onChange({ ...answers, [field]: value });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>, which: 1 | 2) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(which);
    try {
      if (storage) {
        const storageRef = ref(storage, `portraits/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        set(which === 1 ? "photoPortrait" : "photoPortrait2", url);
      } else {
        // Fallback: create local URL
        const url = URL.createObjectURL(file);
        set(which === 1 ? "photoPortrait" : "photoPortrait2", url);
      }
    } catch {
      // silent fail
    } finally {
      setUploadingPhoto(null);
    }
  }

  const canProceed = answers.nom && answers.prenoms && answers.sexe && answers.ville;

  return (
    <div className="space-y-6">
      {/* Type d'evenement */}
      <div>
        <label className={labelStyles}>Quel type de faire-part souhaitez-vous creer ?</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {(["funerailles", "mariage-traditionnel", "mariage-civil", "mariage-religieux", "levee-de-deuil", "bapteme"] as EventType[]).map((type) => (
            <button
              key={type}
              onClick={() => set("eventType", type)}
              className={`text-left p-3 border text-xs transition-all ${
                answers.eventType === type
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-border text-charcoal hover:border-accent/30"
              }`}
            >
              {EVENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* PERSONNE PRINCIPALE */}
      <div className="border border-accent/20 p-5 sm:p-6 bg-white">
        <h3 className="font-heading text-lg text-charcoal mb-4 flex items-center gap-2">
          <User size={18} className="text-accent" />
          {isFunerailles ? "Le defunt / La defunte" : isMariage ? "Le marie" : "L'enfant"}
        </h3>

        {/* Sexe - CRUCIAL pour les textes */}
        <div className="mb-4">
          <label className={labelStyles}>Sexe *</label>
          <div className="flex gap-3">
            <button
              onClick={() => set("sexe", "homme")}
              className={`flex-1 py-3 text-sm border transition-all ${
                answers.sexe === "homme" ? "border-accent bg-accent/10 text-accent" : "border-border text-charcoal"
              }`}
            >
              Homme
            </button>
            <button
              onClick={() => set("sexe", "femme")}
              className={`flex-1 py-3 text-sm border transition-all ${
                answers.sexe === "femme" ? "border-accent bg-accent/10 text-accent" : "border-border text-charcoal"
              }`}
            >
              Femme
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>Nom de famille *</label>
            <input type="text" value={answers.nom} onChange={(e) => set("nom", e.target.value)} className={inputStyles} placeholder="Tchinda" />
          </div>
          <div>
            <label className={labelStyles}>Prenoms *</label>
            <input type="text" value={answers.prenoms} onChange={(e) => set("prenoms", e.target.value)} className={inputStyles} placeholder="Jean Pierre" />
          </div>
          <div>
            <label className={labelStyles}>Titre honorifique</label>
            <select value={answers.titreHonorifique} onChange={(e) => set("titreHonorifique", e.target.value)} className={inputStyles}>
              <option value="">Aucun</option>
              {TITRES_HONORIFIQUES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyles}>Profession</label>
            <input type="text" value={answers.profession} onChange={(e) => set("profession", e.target.value)} className={inputStyles} placeholder="Enseignant, commercant..." />
          </div>

          {isFunerailles && (
            <>
              <div>
                <label className={labelStyles}>Date de naissance</label>
                <input type="text" value={answers.dateNaissance} onChange={(e) => set("dateNaissance", e.target.value)} className={inputStyles} placeholder="12 mars 1945" />
              </div>
              <div>
                <label className={labelStyles}>Date de deces</label>
                <input type="text" value={answers.dateDeces} onChange={(e) => set("dateDeces", e.target.value)} className={inputStyles} placeholder="8 avril 2026" />
              </div>
              <div>
                <label className={labelStyles}>Lieu de naissance</label>
                <input type="text" value={answers.lieuNaissance} onChange={(e) => set("lieuNaissance", e.target.value)} className={inputStyles} placeholder="Foto, Dschang" />
              </div>
              <div>
                <label className={labelStyles}>Lieu de deces</label>
                <input type="text" value={answers.lieuDeces} onChange={(e) => set("lieuDeces", e.target.value)} className={inputStyles} placeholder="Hopital de Dschang" />
              </div>
            </>
          )}

          <div>
            <label className={labelStyles}>Village d&apos;origine</label>
            <input type="text" value={answers.village} onChange={(e) => set("village", e.target.value)} className={inputStyles} placeholder="Foto" />
          </div>
          <div>
            <label className={labelStyles}>Surnom / Nom traditionnel</label>
            <input type="text" value={answers.surnom} onChange={(e) => set("surnom", e.target.value)} className={inputStyles} placeholder='Ex: "Le Sage de Foto"' />
          </div>
          <div>
            <label className={labelStyles}>Titre traditionnel</label>
            <input type="text" value={answers.titreTradi} onChange={(e) => set("titreTradi", e.target.value)} className={inputStyles} placeholder="Notable du groupement Foto - 7 cranes" />
          </div>
          <div>
            <label className={labelStyles}>Chefferie / Groupement</label>
            <input type="text" value={answers.chefferie} onChange={(e) => set("chefferie", e.target.value)} className={inputStyles} placeholder="Groupement Foto" />
          </div>
          <div>
            <label className={labelStyles}>Decorations / Distinctions</label>
            <input type="text" value={answers.decorations} onChange={(e) => set("decorations", e.target.value)} className={inputStyles} placeholder="Chevalier de l'Ordre de la Valeur" />
          </div>
          {isFunerailles && (
            <div className="sm:col-span-2">
              <label className={labelStyles}>Mention sur la cause du deces (optionnel)</label>
              <input type="text" value={answers.causeDecesMention} onChange={(e) => set("causeDecesMention", e.target.value)} className={inputStyles} placeholder="des suites d'une longue maladie courageusement supportee" />
            </div>
          )}
          <div>
            <label className={labelStyles}>Nom du conjoint</label>
            <input type="text" value={answers.conjoint} onChange={(e) => set("conjoint", e.target.value)} className={inputStyles} placeholder="Marie Claire Kengne" />
          </div>
          <div>
            <label className={labelStyles}>Nombre d&apos;enfants</label>
            <input type="text" value={answers.nbEnfants} onChange={(e) => set("nbEnfants", e.target.value)} className={inputStyles} placeholder="8" />
          </div>
        </div>

        {/* Photo portrait */}
        <div className="mt-4">
          <label className={labelStyles}>Photo portrait *</label>
          <div className="flex items-center gap-4">
            {answers.photoPortrait && answers.photoPortrait !== "/images/fondatrice.jpg" ? (
              <div className="w-20 h-24 border border-accent/30 bg-cover bg-center" style={{ backgroundImage: `url(${answers.photoPortrait})` }} />
            ) : (
              <div className="w-20 h-24 border border-border bg-cream flex items-center justify-center">
                <Camera size={20} className="text-muted/30" />
              </div>
            )}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border border-accent/30 text-accent text-xs hover:bg-accent/5 transition-colors">
              <Upload size={14} />
              {uploadingPhoto === 1 ? "Envoi..." : "Choisir une photo"}
              <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 1)} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* SECOND PERSON (mariage) */}
      {isMariage && (
        <div className="border border-accent/20 p-5 sm:p-6 bg-white">
          <h3 className="font-heading text-lg text-charcoal mb-4 flex items-center gap-2">
            <User size={18} className="text-accent" />
            La mariee
          </h3>
          <div className="mb-4">
            <label className={labelStyles}>Sexe</label>
            <div className="flex gap-3">
              <button onClick={() => set("sexe2", "homme")} className={`flex-1 py-3 text-sm border transition-all ${answers.sexe2 === "homme" ? "border-accent bg-accent/10 text-accent" : "border-border"}`}>Homme</button>
              <button onClick={() => set("sexe2", "femme")} className={`flex-1 py-3 text-sm border transition-all ${answers.sexe2 === "femme" ? "border-accent bg-accent/10 text-accent" : "border-border"}`}>Femme</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Nom *</label>
              <input type="text" value={answers.nom2 || ""} onChange={(e) => set("nom2", e.target.value)} className={inputStyles} placeholder="Fonkou" />
            </div>
            <div>
              <label className={labelStyles}>Prenoms *</label>
              <input type="text" value={answers.prenoms2 || ""} onChange={(e) => set("prenoms2", e.target.value)} className={inputStyles} placeholder="Grace Danielle" />
            </div>
            <div>
              <label className={labelStyles}>Profession</label>
              <input type="text" value={answers.profession2 || ""} onChange={(e) => set("profession2", e.target.value)} className={inputStyles} placeholder="Pharmacienne" />
            </div>
            <div>
              <label className={labelStyles}>Village d&apos;origine</label>
              <input type="text" value={answers.village2 || ""} onChange={(e) => set("village2", e.target.value)} className={inputStyles} placeholder="Bandjoun" />
            </div>
          </div>
          {/* Photo */}
          <div className="mt-4">
            <label className={labelStyles}>Photo portrait</label>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-accent/30 text-accent text-xs hover:bg-accent/5 transition-colors">
              <Upload size={14} />
              {uploadingPhoto === 2 ? "Envoi..." : "Choisir une photo"}
              <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 2)} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* LIEU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>Ville de la ceremonie *</label>
          <input type="text" value={answers.ville} onChange={(e) => set("ville", e.target.value)} className={inputStyles} placeholder="Dschang" />
        </div>
        <div>
          <label className={labelStyles}>Region</label>
          <select value={answers.region} onChange={(e) => set("region", e.target.value)} className={inputStyles}>
            {REGIONS_CAMEROUN.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelStyles}>Eglise / Lieu de culte</label>
          <input type="text" value={answers.eglise} onChange={(e) => set("eglise", e.target.value)} className={inputStyles} placeholder="Eglise catholique Saint-Joseph de Dschang" />
        </div>
      </div>

      {/* SYMBOLE RELIGIEUX */}
      <div>
        <label className={labelStyles}>Symbole religieux</label>
        <div className="flex gap-3">
          {[
            { value: "croix", label: "Croix chretienne" },
            { value: "croissant", label: "Croissant islamique" },
            { value: "aucun", label: "Aucun" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("symboleReligieux", opt.value)}
              className={`flex-1 py-2.5 text-xs border transition-all ${
                (answers.symboleReligieux || "croix") === opt.value ? "border-accent bg-accent/10 text-accent" : "border-border text-charcoal"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* DESCRIPTION LIBRE */}
      <div>
        <label className={labelStyles}>
          Decrivez en quelques phrases ce que vous souhaitez dire dans le faire-part
        </label>
        <p className="text-[10px] text-muted mb-2">
          L&apos;IA va utiliser ces informations pour generer automatiquement la biographie, l&apos;annonce et l&apos;epitaphe. Ecrivez comme vous parlez, soyez naturel.
        </p>
        <textarea
          value={answers.description}
          onChange={(e) => set("description", e.target.value)}
          rows={5}
          className={`${inputStyles} resize-y`}
          placeholder={
            isFunerailles
              ? "Ex: Mon pere etait un homme genereux, enseignant pendant 35 ans au lycee de Dschang. Il etait notable du village et tres respecte. Il aimait ses petits-enfants plus que tout. Nous voulons une ceremonie digne avec veillee le vendredi soir et enterrement le samedi."
              : "Ex: Nous voulons un mariage traditionnel joyeux, avec la dot complete. Les deux familles sont de Dschang et Bafoussam. Le marie est ingenieur, la mariee pharmacienne."
          }
        />
      </div>

      {/* NEXT */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-full py-4 text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
          canProceed
            ? "bg-accent text-white hover:bg-accent-dark"
            : "bg-muted/20 text-muted cursor-not-allowed"
        }`}
      >
        Generer le faire-part automatiquement
      </button>
    </div>
  );
}
