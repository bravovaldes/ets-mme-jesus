"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  FileText,
  Building2,
  Church,
  Flower2,
  Users,
  Heart,
  CheckCircle2,
  Circle,
  ChevronDown,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
  when: string;
  tasks: { text: string; detail: string }[];
}

const steps: Step[] = [
  {
    id: "immediat",
    title: "Les premieres heures",
    icon: Phone,
    when: "Dans les 24 heures suivant le deces",
    tasks: [
      {
        text: "Faire constater le deces par un medecin",
        detail:
          "Un medecin doit etablir un certificat de deces. Si le deces a lieu a l'hopital, le certificat est delivre par l'etablissement.",
      },
      {
        text: "Prevenir la famille proche",
        detail:
          "Informez les membres de la famille immediate, les freres et soeurs, les enfants. WhatsApp est le moyen le plus rapide.",
      },
      {
        text: "Contacter un organisateur de funerailles",
        detail:
          "Appelez ETS Mme Jesus au telephone ou sur WhatsApp. Nous prendrons en charge toutes les demarches suivantes.",
      },
      {
        text: "Conserver les documents du defunt",
        detail:
          "Carte nationale d'identite, acte de naissance, livret de famille, permis de conduire. Ces documents seront necessaires pour les formalites.",
      },
    ],
  },
  {
    id: "administratif",
    title: "Les demarches administratives",
    icon: FileText,
    when: "Dans les 48 heures",
    tasks: [
      {
        text: "Declarer le deces a la mairie",
        detail:
          "La declaration se fait a la mairie du lieu de deces, munie du certificat medical et de la piece d'identite du defunt.",
      },
      {
        text: "Obtenir le permis d'inhumer",
        detail:
          "Delivre par le maire ou le sous-prefet. Necessaire avant tout enterrement. ETS Mme Jesus peut s'en charger pour vous.",
      },
      {
        text: "Commander les copies d'acte de deces",
        detail:
          "Demandez plusieurs copies, elles seront necessaires pour les assurances, la banque, le notaire, etc.",
      },
      {
        text: "Prevenir l'employeur du defunt (si applicable)",
        detail:
          "L'employeur doit etre informe pour les droits de succession, les indemnites et les formalites CNPS.",
      },
    ],
  },
  {
    id: "eglise",
    title: "L'organisation religieuse",
    icon: Church,
    when: "2 a 5 jours avant la ceremonie",
    tasks: [
      {
        text: "Contacter le responsable religieux",
        detail:
          "Curate, pasteur ou imam — selon la confession du defunt. Fixer la date et l'heure de la ceremonie.",
      },
      {
        text: "Preparer le programme de la ceremonie",
        detail:
          "Chants, lectures, temoignages, hommages. ETS Mme Jesus peut vous aider a rediger et imprimer le programme.",
      },
      {
        text: "Coordonner la chorale",
        detail:
          "Si une chorale est souhaitee, confirmez leur disponibilite et les chants choisis.",
      },
    ],
  },
  {
    id: "logistique",
    title: "La logistique",
    icon: Flower2,
    when: "3 a 7 jours avant la ceremonie",
    tasks: [
      {
        text: "Choisir et amenager la salle de veillee",
        detail:
          "La veillee a generalement lieu au domicile familial ou dans un lieu dedie. Prevoir chaises, eclairage, baches en cas de pluie.",
      },
      {
        text: "Commander la decoration",
        detail:
          "Chapelle ardente, fleurs, drapes, bougies. Chaque element contribue a la dignite de l'hommage.",
      },
      {
        text: "Reserver le traiteur",
        detail:
          "Repas de veillee et reception post-enterrement. Prevoir les boissons. Compter 3 000 a 5 000 FCFA par invite.",
      },
      {
        text: "Organiser le transport",
        detail:
          "Corbillard pour la depouille, bus ou minibus pour les invites, vehicules VIP pour la famille.",
      },
      {
        text: "Commander les faire-parts",
        detail:
          "Faire-parts d'annonce a distribuer et/ou partager sur les reseaux sociaux. Programmes de ceremonie a imprimer.",
      },
    ],
  },
  {
    id: "ceremonie",
    title: "Le jour de la ceremonie",
    icon: Users,
    when: "Le jour J",
    tasks: [
      {
        text: "Verifier que tout est en place",
        detail:
          "Decoration, sonorisation, chaises, traiteur. ETS Mme Jesus fait un tour complet des installations avant l'arrivee des invites.",
      },
      {
        text: "Accueillir les invites",
        detail:
          "Prevoir un accueil organise avec un registre de presences et une orientation vers les places assises.",
      },
      {
        text: "Suivre le deroulement du programme",
        detail:
          "Notre chef de projet veille au respect du planning : arrivee du cortege, ceremonie, mise en terre, reception.",
      },
    ],
  },
  {
    id: "apres",
    title: "Apres la ceremonie",
    icon: Heart,
    when: "Dans les jours et mois suivants",
    tasks: [
      {
        text: "Remercier les participants",
        detail:
          "Envoyer un message de remerciement aux personnes qui ont contribue financierement ou moralement.",
      },
      {
        text: "Regler les formalites de succession",
        detail:
          "Consulter un notaire pour la succession. Prevenir la banque, les assurances, la CNPS.",
      },
      {
        text: "Planifier la levee de deuil",
        detail:
          "Traditionnellement organisee quelques mois apres les obseques. ETS Mme Jesus peut s'en charger.",
      },
      {
        text: "Creer une page hommage",
        detail:
          "Conservez les souvenirs de la ceremonie et recueillez les condoleances en ligne. Demandez votre page hommage gratuite.",
      },
    ],
  },
];

function StepSection({ step, index }: { step: Step; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const Icon = step.icon;

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = step.tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white border border-border overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 border border-accent/30 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-accent" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading text-lg sm:text-xl text-charcoal">
              {step.title}
            </h3>
            {completedCount > 0 && (
              <span className="text-xs text-accent bg-accent/10 px-2 py-0.5">
                {completedCount}/{totalCount}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">{step.when}</p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown size={20} className="text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
              {step.tasks.map((task, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 sm:p-4 border transition-all duration-300 cursor-pointer ${
                    checked[i]
                      ? "border-accent/20 bg-accent/5"
                      : "border-border hover:border-accent/20"
                  }`}
                  onClick={() =>
                    setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
                  }
                >
                  <div className="mt-0.5 shrink-0">
                    {checked[i] ? (
                      <CheckCircle2
                        size={18}
                        className="text-accent"
                      />
                    ) : (
                      <Circle size={18} className="text-muted/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        checked[i]
                          ? "text-accent line-through"
                          : "text-charcoal"
                      }`}
                    >
                      {task.text}
                    </p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {task.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GuideDemarchesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-normal mb-6">
            Que faire quand un proche decede ?
          </h1>
          <p className="text-cream/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Un guide etape par etape pour vous accompagner dans les demarches.
            Cochez les taches au fur et a mesure pour suivre votre avancement.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-cream py-12 sm:py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {steps.map((step, i) => (
            <StepSection key={step.id} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-xl sm:text-2xl text-charcoal mb-4">
            Vous avez besoin d&apos;aide ?
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Nous savons que cette periode est difficile. ETS Mme Jesus peut
            prendre en charge l&apos;ensemble de ces demarches pour vous.
            Appelez-nous a tout moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "14184901849"}?text=${encodeURIComponent("Bonjour, j'ai besoin d'aide pour organiser des obseques.")}`}
              variant="whatsapp"
              external
            >
              Appeler sur WhatsApp
            </Button>
            <Button href="/contact" variant="accent">
              Demander un devis
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
