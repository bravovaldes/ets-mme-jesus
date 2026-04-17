"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const faqs = [
  {
    question: "Un proche vient de deceder. Que faire en premier ?",
    answer:
      "Appelez-nous immediatement au telephone ou sur WhatsApp. Nous sommes disponibles 24h/24. Nous vous guiderons dans les premieres demarches et prendrons en charge l'organisation des que possible.",
  },
  {
    question: "Combien coute l'organisation d'obseques completes ?",
    answer:
      "Le cout varie selon le nombre d'invites, les services souhaites et le lieu. Nos prestations vont de 2 000 000 FCFA pour une ceremonie simple a plus de 20 000 000 FCFA pour un grand evenement. Nous etablissons toujours un devis detaille avant de commencer.",
  },
  {
    question: "Je vis a l'etranger. Pouvez-vous tout organiser a distance ?",
    answer:
      "Absolument. Nous accompagnons regulierement des familles de la diaspora. Toute la coordination se fait par WhatsApp et appels telephoniques. Vous recevez des photos et mises a jour a chaque etape.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les virements bancaires, Mobile Money (MTN MoMo, Orange Money) et les paiements en especes. Un acompte est demande au demarrage, le solde est regle avant la ceremonie.",
  },
  {
    question: "Quel est le delai minimum pour organiser des obseques ?",
    answer:
      "Nous pouvons organiser une ceremonie complete en 48 a 72 heures en cas d'urgence. Pour un evenement plus elabore, nous recommandons un delai d'une a deux semaines.",
  },
  {
    question: "Organisez-vous aussi les levees de deuil ?",
    answer:
      "Oui, la levee de deuil est l'un de nos services. Elle a generalement lieu plusieurs mois apres les obseques. Nous la traitons avec le meme soin et la meme rigueur que la ceremonie initiale.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left gap-4"
      >
        <span className="font-heading text-base sm:text-lg text-charcoal pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown size={20} className="text-accent" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="text-muted text-sm leading-relaxed pb-5 sm:pb-6 pr-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Questions frequentes"
          subtitle="Les reponses aux questions que les familles nous posent le plus souvent."
        />

        <div className="border-t border-border">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
