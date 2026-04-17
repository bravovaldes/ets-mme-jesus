import type { Metadata } from "next";
import Image from "next/image";
import Values from "@/components/about/Values";
import Stats from "@/components/about/Stats";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "A propos",
  description:
    "Decouvrez l'histoire d'ETS Mme Jesus et de sa fondatrice. Plus de 10 ans d'experience dans l'evenementiel funeraire a Dschang.",
};

const trustReasons = [
  "Prise en charge complete de A a Z",
  "Reseau de partenaires fiables et experimentes",
  "Equipe formee et devouee",
  "Transparence totale sur les prix",
  "Disponibilite 24h/24, meme les jours feries",
  "Respect des traditions et des rites familiaux",
];

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-normal mb-6">
            Notre histoire
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">
            {/* Photo */}
            <div className="relative aspect-[4/5] sm:aspect-[3/4]">
              <Image
                src="/images/fondatrice.jpg"
                alt="Mme Jesus, fondatrice d'ETS Mme Jesus"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-accent/20" />
            </div>

            {/* Text */}
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-charcoal font-normal mb-6 sm:mb-8">
                Mme Jesus
              </h2>
              <div className="w-16 h-px bg-accent mb-8" />
              <div className="space-y-6 text-charcoal/80 leading-relaxed">
                <p>
                  C&apos;est au coeur de Dschang, dans la region de l&apos;Ouest
                  Cameroun, que Mme Jesus a fonde son entreprise
                  d&apos;evenementiel funeraire. Animee par une profonde empathie
                  et un sens aigu de l&apos;organisation, elle a consacre plus
                  d&apos;une decennie a accompagner les familles dans leurs
                  moments les plus difficiles.
                </p>
                <p>
                  Son parcours a commence par l&apos;observation d&apos;un
                  besoin criant : trop de familles endeuillees se retrouvaient
                  submergees par les demarches, la logistique et la pression
                  sociale liee a l&apos;organisation des funerailles. Mme Jesus
                  a decide d&apos;en faire sa mission.
                </p>
                <p>
                  Aujourd&apos;hui, ETS Mme Jesus est une reference dans
                  l&apos;Ouest Cameroun. Chaque ceremonie est traitee avec le
                  meme soin, la meme rigueur, le meme respect — qu&apos;il
                  s&apos;agisse d&apos;une veillee intime ou d&apos;un hommage
                  rassemblant plus de 2000 personnes.
                </p>
              </div>

              <blockquote className="mt-10 pl-6 border-l-2 border-accent">
                <p className="font-heading text-xl italic text-charcoal/70 leading-relaxed">
                  &ldquo;Chaque famille merite de vivre son deuil en paix. Notre
                  travail, c&apos;est de porter le poids de l&apos;organisation
                  pour qu&apos;elles puissent se consacrer a
                  l&apos;essentiel.&rdquo;
                </p>
                <footer className="mt-3 text-accent text-sm">
                  &mdash; Mme Jesus
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <Values />

      {/* Stats */}
      <Stats />

      {/* Trust */}
      <section className="bg-cream py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-charcoal font-normal mb-4 text-center">
            Pourquoi nous faire confiance
          </h2>
          <div className="w-16 h-px bg-accent mx-auto mb-12" />

          <ul className="space-y-4">
            {trustReasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-4 text-charcoal/80"
              >
                <Check
                  size={18}
                  className="text-accent mt-0.5 shrink-0"
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <div className="text-center mt-12">
            <Button href="/contact" variant="accent">
              Prendre contact
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
