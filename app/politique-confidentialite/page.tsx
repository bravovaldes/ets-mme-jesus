import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl text-cream font-normal">
            Politique de confidentialite
          </h1>
        </div>
      </section>
      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm text-charcoal/80">
          <h2 className="font-heading text-2xl text-charcoal">Collecte des donnees</h2>
          <p>
            Nous collectons uniquement les donnees que vous nous transmettez
            volontairement via le formulaire de contact : nom, telephone, email,
            et les details de votre demande de devis.
          </p>
          <h2 className="font-heading text-2xl text-charcoal">Utilisation des donnees</h2>
          <p>
            Vos donnees sont utilisees exclusivement pour repondre a votre
            demande et vous fournir un devis personnalise. Elles ne sont jamais
            vendues ni partagees avec des tiers.
          </p>
          <h2 className="font-heading text-2xl text-charcoal">Conservation</h2>
          <p>
            Vos donnees sont conservees pendant la duree necessaire au
            traitement de votre demande, puis supprimees.
          </p>
          <h2 className="font-heading text-2xl text-charcoal">Vos droits</h2>
          <p>
            Vous disposez d&apos;un droit d&apos;acces, de rectification et de
            suppression de vos donnees. Pour exercer ces droits, contactez-nous
            par email a {process.env.NEXT_PUBLIC_EMAIL}.
          </p>
          <h2 className="font-heading text-2xl text-charcoal">Cookies</h2>
          <p>
            Ce site n&apos;utilise pas de cookies de suivi. Seuls des cookies
            techniques essentiels au fonctionnement du site peuvent etre
            deposes.
          </p>
        </div>
      </section>
    </>
  );
}
