import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact & Devis",
  description:
    "Contactez ETS Mme Jesus pour organiser des obseques, une veillee ou une levee de deuil. Reponse sous une heure, 24h/24.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-normal mb-6">
            Prenons contact
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Nous vous repondons dans l&apos;heure, 24h/24.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3 bg-white p-5 sm:p-8 lg:p-12 border border-border">
              <h2 className="font-heading text-2xl text-charcoal mb-8">
                Formulaire de demande de devis
              </h2>
              <Suspense fallback={<div className="text-muted">Chargement...</div>}>
                <ContactForm />
              </Suspense>
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
