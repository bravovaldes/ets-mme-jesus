"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Send, Loader2, Check, Sparkles, ChevronRight, RefreshCw } from "lucide-react";
import type { FairePartPage } from "@/lib/types";
import { EVENT_TYPE_LABELS, DEFAULT_DESIGNS } from "@/lib/types";
import { generateSlug } from "@/lib/creator-helpers";
import InterviewStep, { type InterviewAnswers } from "@/components/creator/InterviewStep";
import Step3Famille from "@/components/creator/Step3Famille";
import Step5Infos from "@/components/creator/Step5Infos";

export default function CreerFairePartPage() {
  const [phase, setPhase] = useState<"interview" | "generating" | "review" | "submitted">("interview");
  const [answers, setAnswers] = useState<InterviewAnswers>({
    eventType: "funerailles",
    sexe: "homme",
    nom: "", prenoms: "", titreHonorifique: "", dateNaissance: "", dateDeces: "",
    lieuNaissance: "", lieuDeces: "", profession: "", titreTradi: "", village: "",
    surnom: "", causeDecesMention: "", decorations: "", chefferie: "",
    conjoint: "", nbEnfants: "", ville: "", region: "Ouest", eglise: "",
    symboleReligieux: "croix", description: "",
    photoPortrait: "/images/fondatrice.jpg",
  });
  const [fp, setFp] = useState<Partial<FairePartPage>>({});
  const [activeTab, setActiveTab] = useState<"textes" | "famille" | "infos">("textes");
  const [submitting, setSubmitting] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [rewriting, setRewriting] = useState(false);

  function update<K extends keyof FairePartPage>(field: K, value: FairePartPage[K]) {
    setFp((prev) => ({ ...prev, [field]: value }));
  }

  // ========================
  // PHASE 1 -> 2: Generate
  // ========================
  async function handleGenerate() {
    setPhase("generating");

    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "generate-full", answers }),
      });

      const data = await res.json();
      const aiResult = data.result;

      // Build the faire-part from AI result + user answers
      const isFunerailles = answers.eventType === "funerailles" || answers.eventType === "levee-de-deuil";
      const isMariage = answers.eventType.startsWith("mariage");
      const designKey = isMariage
        ? "mariage-traditionnel"
        : answers.eventType === "levee-de-deuil"
          ? "levee-deuil"
          : "funerailles-bamileke";

      const personnes = [
        {
          nom: answers.nom,
          prenoms: answers.prenoms,
          sexe: answers.sexe as "homme" | "femme",
          titreHonorifique: answers.titreHonorifique || (isFunerailles ? (answers.sexe === "femme" ? "Feue Maman" : "Feu Papa") : undefined),
          surnom: answers.surnom || undefined,
          dateNaissance: answers.dateNaissance || undefined,
          dateDeces: answers.dateDeces || undefined,
          lieuNaissance: answers.lieuNaissance || undefined,
          lieuDeces: answers.lieuDeces || undefined,
          causeDecesMention: answers.causeDecesMention || undefined,
          profession: answers.profession || undefined,
          titreTradi: answers.titreTradi || undefined,
          villageOrigine: answers.village || undefined,
          chefferie: answers.chefferie || undefined,
          decorations: answers.decorations ? answers.decorations.split(",").map((d) => d.trim()).filter(Boolean) : undefined,
          photoPortrait: answers.photoPortrait || "/images/fondatrice.jpg",
          ageAuDeces: aiResult?.personneUpdates?.ageAuDeces || undefined,
        },
        ...(isMariage && answers.nom2 ? [{
          nom: answers.nom2,
          prenoms: answers.prenoms2 || "",
          sexe: (answers.sexe2 || "femme") as "homme" | "femme",
          profession: answers.profession2 || undefined,
          villageOrigine: answers.village2 || undefined,
          photoPortrait: answers.photoPortrait2 || "/images/fondatrice.jpg",
        }] : []),
      ];

      // Build programme from AI or fallback
      const programme = aiResult?.programme?.map((j: { jour: string; evenements: { heure: string; titre: string; lieu: string; description?: string }[] }, i: number) => ({
        id: `j${i}`,
        jour: j.jour,
        evenements: j.evenements || [],
      })) || [{
        id: "j1",
        jour: "[DATE A PRECISER]",
        evenements: [
          { heure: "09h00", titre: "Ceremonie", lieu: answers.eglise || answers.ville },
        ],
      }];

      const generated: Partial<FairePartPage> = {
        eventType: answers.eventType,
        titre: aiResult?.titre || (answers.eventType === "funerailles" ? "Faire-part de deces et de funerailles" : "Invitation"),
        sousTitre: aiResult?.sousTitre || "",
        versetBiblique: aiResult?.versetBiblique || "",
        epitaphe: aiResult?.epitaphe || "",
        biographie: aiResult?.biographie || "",
        remerciements: aiResult?.remerciements || "",
        messageInvitation: aiResult?.messageInvitation || "",
        personnes,
        famille: [
          { categorie: "epouse", membres: answers.conjoint ? [{ nom: answers.conjoint }] : [] },
          { categorie: "enfants", membres: answers.nbEnfants ? [{ nom: `${answers.nbEnfants} enfants (a completer)` }] : [] },
        ],
        programme,
        photos: [],
        contactsFamille: [{ nom: `${answers.prenoms} ${answers.nom}`, telephone: "", ville: answers.ville }],
        contactOrganisateur: "+1 418 490 1849",
        ville: answers.ville,
        region: answers.region,
        familleName: isMariage ? `Familles ${answers.nom} & ${answers.nom2 || ""}` : `Famille ${answers.nom}`,
        codeVestimentaire: aiResult?.codeVestimentaire || "",
        celebrant: answers.eglise ? "" : undefined,
        contributions: {},
        isPrivate: false,
        isPublished: false,
        isPending: true,
        allowCondolences: true,
        allowPhotoDownload: true,
        coverImage: answers.photoPortrait || "",
        symboleReligieux: (answers.symboleReligieux as "croix" | "croissant" | "aucun") || "croix",
        fairePartDesign: DEFAULT_DESIGNS[designKey] || DEFAULT_DESIGNS["funerailles-bamileke"],
      };

      setFp(generated);
      setPhase("review");
    } catch (err) {
      console.error("Generation error:", err);
      // Fallback: go to review with minimal data
      setFp({
        eventType: answers.eventType,
        titre: "Faire-part",
        sousTitre: "",
        personnes: [{ nom: answers.nom, prenoms: answers.prenoms, sexe: answers.sexe, photoPortrait: answers.photoPortrait }],
        famille: [],
        programme: [{ id: "j1", jour: "", evenements: [] }],
        photos: [],
        contactsFamille: [{ nom: "", telephone: "" }],
        contactOrganisateur: "+1 418 490 1849",
        ville: answers.ville,
        region: answers.region,
        familleName: `Famille ${answers.nom}`,
        isPrivate: false, isPublished: false, isPending: true,
        allowCondolences: true, allowPhotoDownload: true,
        coverImage: "", symboleReligieux: "croix",
        fairePartDesign: DEFAULT_DESIGNS["funerailles-bamileke"],
      });
      setPhase("review");
    }
  }

  // ========================
  // Rewrite section with AI
  // ========================
  async function handleRewrite(section: string) {
    if (!editText.trim()) return;
    setRewriting(true);
    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rewrite-section",
          section,
          answers: { ...answers, userText: editText },
        }),
      });
      const data = await res.json();
      if (data.result && typeof data.result === "string") {
        update(section as keyof FairePartPage, data.result as never);
      }
      setEditingSection(null);
      setEditText("");
    } catch {
      // silent
    } finally {
      setRewriting(false);
    }
  }

  // ========================
  // Submit
  // ========================
  async function handleSubmit() {
    setSubmitting(true);
    try {
      const mainPerson = fp.personnes?.[0];
      const slug = generateSlug(`${mainPerson?.prenoms || "fp"}-${mainPerson?.nom || ""}-${Date.now()}`);
      if (db) {
        await addDoc(collection(db, "faireParts"), {
          ...fp, slug, id: slug, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
      }
      setPhase("submitted");
    } catch {
      setPhase("submitted");
    } finally {
      setSubmitting(false);
    }
  }

  // ========================
  // Section editable component
  // ========================
  function EditableSection({ label, field, value }: { label: string; field: string; value: string }) {
    const isEditing = editingSection === field;
    return (
      <div className="border border-border p-4 sm:p-5 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-charcoal">{label}</h4>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button onClick={() => { setEditingSection(field); setEditText(""); }} className="text-[10px] text-accent hover:text-accent-dark flex items-center gap-1">
                <Sparkles size={10} /> Modifier avec l&apos;IA
              </button>
            )}
          </div>
        </div>

        {/* Current value */}
        <div
          className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-line cursor-text"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update(field as keyof FairePartPage, e.currentTarget.textContent || "" as never)}
        >
          {value || "(cliquez pour ecrire...)"}
        </div>

        {/* AI rewrite input */}
        {isEditing && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <p className="text-[10px] text-muted">Dites en quelques mots ce que vous voulez changer :</p>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-cream border border-accent/20 text-sm focus:outline-none focus:border-accent resize-none"
              placeholder="Ex: il etait aussi pasteur et aimait beaucoup le football..."
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRewrite(field)}
                disabled={rewriting || !editText.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs disabled:opacity-50"
              >
                {rewriting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {rewriting ? "Generation..." : "Regenerer"}
              </button>
              <button onClick={() => setEditingSection(null)} className="text-xs text-muted hover:text-charcoal">
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-28 sm:pt-32 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl text-cream font-normal mb-3">
            Creer votre faire-part
          </h1>
          <p className="text-cream/60 text-sm">
            {phase === "interview" && "Repondez a quelques questions, l'IA se charge du reste."}
            {phase === "generating" && "Generation en cours..."}
            {phase === "review" && "Votre faire-part a ete genere. Relisez et ajustez si besoin."}
            {phase === "submitted" && "Fait !"}
          </p>
        </div>
      </section>

      <section className="bg-cream py-6 sm:py-10 min-h-[50vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { id: "interview", label: "Informations", n: 1 },
              { id: "review", label: "Relecture", n: 2 },
              { id: "submitted", label: "Envoi", n: 3 },
            ].map((s) => {
              const phaseOrder = { interview: 1, generating: 1.5, review: 2, submitted: 3 };
              const currentOrder = phaseOrder[phase] || 1;
              const isActive = (phase === s.id) || (phase === "generating" && s.id === "interview");
              const isDone = currentOrder > s.n;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                    isActive ? "bg-accent text-white" : isDone ? "bg-accent/10 text-accent" : "bg-white text-muted/40"
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isDone ? "bg-accent/20" : isActive ? "bg-white/20" : "bg-muted/10"
                    }`}>
                      {isDone ? <Check size={10} /> : s.n}
                    </span>
                    {s.label}
                  </div>
                  {s.n < 3 && <ChevronRight size={14} className="text-muted/30" />}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* ===================== INTERVIEW ===================== */}
            {phase === "interview" && (
              <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InterviewStep answers={answers} onChange={setAnswers} onNext={handleGenerate} />
              </motion.div>
            )}

            {/* ===================== GENERATING ===================== */}
            {phase === "generating" && (
              <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-2 border-accent/30 rounded-full animate-spin border-t-accent" />
                  <Sparkles size={20} className="text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="font-heading text-xl text-charcoal mb-2">L&apos;IA redige votre faire-part...</p>
                <p className="text-muted text-sm">Biographie, annonce, programme — tout est genere automatiquement.</p>
              </motion.div>
            )}

            {/* ===================== REVIEW ===================== */}
            {phase === "review" && (
              <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Sub-tabs */}
                <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
                  {([
                    { id: "textes" as const, label: "Textes (generes par l'IA)" },
                    { id: "famille" as const, label: "Famille" },
                    { id: "infos" as const, label: "Contacts & infos" },
                  ]).map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-xs whitespace-nowrap border transition-all ${
                        activeTab === tab.id ? "bg-primary text-cream border-primary" : "bg-white text-charcoal border-border hover:border-accent/30"
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TEXTES TAB */}
                {activeTab === "textes" && (
                  <div className="space-y-4">
                    <div className="bg-accent/5 border border-accent/20 p-3 flex items-start gap-2">
                      <Sparkles size={14} className="text-accent mt-0.5 shrink-0" />
                      <p className="text-xs text-charcoal/70">
                        Ces textes ont ete generes par l&apos;IA. Cliquez directement sur un texte pour le modifier, ou utilisez &quot;Modifier avec l&apos;IA&quot; pour regenerer une section en donnant des instructions.
                      </p>
                    </div>
                    <EditableSection label="Formule d'annonce" field="sousTitre" value={fp.sousTitre || ""} />
                    <EditableSection label="Epitaphe / Hommage" field="epitaphe" value={fp.epitaphe || ""} />
                    <EditableSection label="Biographie" field="biographie" value={fp.biographie || ""} />
                    <EditableSection label="Verset biblique" field="versetBiblique" value={fp.versetBiblique || ""} />
                    {fp.eventType?.startsWith("mariage") && (
                      <EditableSection label="Message d'invitation" field="messageInvitation" value={fp.messageInvitation || ""} />
                    )}
                    <EditableSection label="Remerciements" field="remerciements" value={fp.remerciements || ""} />

                    {/* Regenerate all button */}
                    <button
                      onClick={() => { setPhase("interview"); }}
                      className="flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors"
                    >
                      <RefreshCw size={12} /> Recommencer avec d&apos;autres informations
                    </button>
                  </div>
                )}

                {/* FAMILLE TAB */}
                {activeTab === "famille" && (
                  <div className="bg-white border border-border p-5 sm:p-8">
                    <Step3Famille
                      eventType={fp.eventType || "funerailles"}
                      famille={fp.famille || []}
                      onChange={(v) => update("famille", v)}
                      familleName={fp.familleName || ""}
                      onChangeFamilleName={(v) => update("familleName", v)}
                    />
                  </div>
                )}

                {/* INFOS TAB */}
                {activeTab === "infos" && (
                  <div className="bg-white border border-border p-5 sm:p-8">
                    <Step5Infos
                      eventType={fp.eventType || "funerailles"}
                      ville={fp.ville || ""}
                      onChangeVille={(v) => update("ville", v)}
                      region={fp.region || "Ouest"}
                      onChangeRegion={(v) => update("region", v)}
                      adresseReception={fp.adresseReception || ""}
                      onChangeAdresse={(v) => update("adresseReception", v)}
                      codeVestimentaire={fp.codeVestimentaire || ""}
                      onChangeCodeVest={(v) => update("codeVestimentaire", v)}
                      pagneInfo={fp.pagneInfo || ""}
                      onChangePagne={(v) => update("pagneInfo", v)}
                      infoHebergement={fp.infoHebergement || ""}
                      onChangeHeberg={(v) => update("infoHebergement", v)}
                      infoTransport={fp.infoTransport || ""}
                      onChangeTransport={(v) => update("infoTransport", v)}
                      celebrant={fp.celebrant || ""}
                      onChangeCelebrant={(v) => update("celebrant", v)}
                      remerciements={fp.remerciements || ""}
                      onChangeRemerciements={(v) => update("remerciements", v)}
                      contactsFamille={fp.contactsFamille || []}
                      onChangeContacts={(v) => update("contactsFamille", v)}
                      contributions={fp.contributions || {}}
                      onChangeContributions={(v) => update("contributions", v)}
                      isPrivate={fp.isPrivate || false}
                      onChangePrivate={(v) => update("isPrivate", v)}
                    />
                  </div>
                )}

                {/* Submit bar */}
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-4 text-sm bg-accent text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Envoi...</>
                    ) : (
                      <><Send size={16} /> Soumettre pour approbation</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===================== SUBMITTED ===================== */}
            {phase === "submitted" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-border p-8 sm:p-12 text-center">
                <div className="w-16 h-16 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-accent" />
                </div>
                <h2 className="font-heading text-2xl text-charcoal mb-3">Faire-part soumis !</h2>
                <p className="text-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Notre equipe va verifier et publier votre faire-part. Vous serez contacte(e) par telephone ou WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/faire-part" className="px-6 py-2.5 text-sm border border-border text-charcoal hover:border-accent/30 transition-colors">
                    Voir les faire-parts
                  </a>
                  <a href="/" className="px-6 py-2.5 text-sm bg-primary text-cream hover:bg-primary-light transition-colors">
                    Retour a l&apos;accueil
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
