import type { Metadata } from "next";
import Gallery from "@/components/realisations/Gallery";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Nos realisations",
  description:
    "Decouvrez les ceremonies, veillees et receptions organisees par ETS Mme Jesus a Dschang et dans l'Ouest Cameroun.",
};

export default function RealisationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-normal mb-6">
            Nos realisations
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Chaque ceremonie est unique. Decouvrez quelques-unes des familles
            que nous avons accompagnees.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Gallery />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-charcoal mb-6">
            Vous souhaitez organiser une ceremonie ?
          </h2>
          <Button href="/contact" variant="accent">
            Demander un devis
          </Button>
        </div>
      </section>
    </>
  );
}
