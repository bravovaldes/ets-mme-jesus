"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Flower2,
  Tent,
  UtensilsCrossed,
  FileText,
  Car,
  FileCheck,
  Heart,
  Users,
  Calculator,
} from "lucide-react";
import Button from "@/components/ui/Button";

const serviceOptions = [
  {
    id: "organisation",
    label: "Organisation complete",
    icon: ClipboardList,
    basePrice: 500000,
    perGuestPrice: 500,
    description: "Chef de projet, coordination, planning",
  },
  {
    id: "decoration",
    label: "Decoration & amenagement",
    icon: Flower2,
    basePrice: 300000,
    perGuestPrice: 300,
    description: "Chapelle ardente, fleurs, eclairage",
  },
  {
    id: "materiel",
    label: "Location materiel",
    icon: Tent,
    basePrice: 200000,
    perGuestPrice: 800,
    description: "Tentes, chaises, tables, sono",
  },
  {
    id: "traiteur",
    label: "Traiteur",
    icon: UtensilsCrossed,
    basePrice: 0,
    perGuestPrice: 3000,
    description: "Repas et boissons par invite",
  },
  {
    id: "impression",
    label: "Impression & faire-parts",
    icon: FileText,
    basePrice: 150000,
    perGuestPrice: 200,
    description: "Programmes, faire-parts, banderoles",
  },
  {
    id: "transport",
    label: "Transport",
    icon: Car,
    basePrice: 300000,
    perGuestPrice: 0,
    description: "Corbillard, bus invites, VIP",
  },
  {
    id: "administratif",
    label: "Demarches administratives",
    icon: FileCheck,
    basePrice: 100000,
    perGuestPrice: 0,
    description: "Permis d'inhumer, mairie",
  },
  {
    id: "levee-deuil",
    label: "Levee de deuil",
    icon: Heart,
    basePrice: 400000,
    perGuestPrice: 1500,
    description: "Organisation complete de la levee",
  },
];

const guestRanges = [
  { label: "Moins de 100", value: 75 },
  { label: "100 - 300", value: 200 },
  { label: "300 - 500", value: 400 },
  { label: "500 - 1000", value: 750 },
  { label: "1000+", value: 1200 },
];

function formatCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

export default function SimulateurPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "organisation",
    "decoration",
    "materiel",
  ]);
  const [guests, setGuests] = useState(200);
  const [guestLabel, setGuestLabel] = useState("100 - 300");

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const estimate = useMemo(() => {
    let total = 0;
    const breakdown: { label: string; amount: number }[] = [];

    for (const service of serviceOptions) {
      if (selectedServices.includes(service.id)) {
        const amount =
          service.basePrice + service.perGuestPrice * guests;
        breakdown.push({ label: service.label, amount });
        total += amount;
      }
    }

    return { total, breakdown };
  }, [selectedServices, guests]);

  const whatsappMessage = encodeURIComponent(
    `Bonjour, j'ai utilise votre simulateur de devis.\n\nServices: ${selectedServices.map((id) => serviceOptions.find((s) => s.id === id)?.label).join(", ")}\nNombre d'invites: ${guestLabel}\nEstimation: ${formatCFA(estimate.total)}\n\nJe souhaite recevoir un devis detaille.`
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calculator size={36} className="text-accent mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-normal mb-6">
            Simulateur de devis
          </h1>
          <p className="text-cream/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Obtenez une estimation instantanee du cout de votre ceremonie.
            Selectionnez vos services et le nombre d&apos;invites.
          </p>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Configuration */}
            <div className="lg:col-span-3 space-y-8">
              {/* Guests */}
              <div className="bg-white border border-border p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users size={20} className="text-accent" />
                  <h2 className="font-heading text-xl text-charcoal">
                    Nombre d&apos;invites
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {guestRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setGuests(range.value);
                        setGuestLabel(range.label);
                      }}
                      className={`py-3 px-4 text-sm border transition-all duration-300 ${
                        guests === range.value
                          ? "bg-accent text-white border-accent"
                          : "bg-cream text-charcoal border-border hover:border-accent/50"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="bg-white border border-border p-5 sm:p-8">
                <h2 className="font-heading text-xl text-charcoal mb-6">
                  Services souhaites
                </h2>
                <div className="space-y-3">
                  {serviceOptions.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`w-full flex items-center gap-4 p-4 border transition-all duration-300 text-left ${
                          isSelected
                            ? "border-accent/50 bg-accent/5"
                            : "border-border hover:border-accent/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-accent bg-accent"
                              : "border-muted"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <Icon
                          size={20}
                          className="text-accent shrink-0"
                          strokeWidth={1.5}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal">
                            {service.label}
                          </p>
                          <p className="text-xs text-muted">
                            {service.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Result */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28">
                <motion.div
                  layout
                  className="bg-white border-2 border-accent p-5 sm:p-8"
                >
                  <h2 className="font-heading text-xl text-charcoal mb-6">
                    Estimation
                  </h2>

                  {estimate.breakdown.length === 0 ? (
                    <p className="text-muted text-sm py-4">
                      Selectionnez au moins un service pour voir l&apos;estimation.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {estimate.breakdown.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-charcoal/70">
                              {item.label}
                            </span>
                            <span className="text-charcoal font-medium">
                              {formatCFA(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-4 mb-8">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-charcoal">
                            Total estime
                          </span>
                          <span className="font-heading text-2xl sm:text-3xl text-accent">
                            {formatCFA(estimate.total)}
                          </span>
                        </div>
                        <p className="text-muted text-xs mt-2">
                          *Estimation indicative. Le devis final depend des
                          details specifiques de votre ceremonie.
                        </p>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <Button
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "14184901849"}?text=${whatsappMessage}`}
                      variant="whatsapp"
                      external
                      className="w-full"
                    >
                      Recevoir un devis par WhatsApp
                    </Button>
                    <Button
                      href="/contact"
                      variant="primary"
                      className="w-full"
                    >
                      Demander un devis detaille
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
