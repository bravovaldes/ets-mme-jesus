import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl text-cream font-normal">
            Mentions legales
          </h1>
        </div>
      </section>
      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm text-charcoal/80">
          <h2 className="font-heading text-2xl text-charcoal">Editeur du site</h2>
          <p>
            ETS Mme Jesus<br />
            Dschang, Cameroun<br />
            Telephone : {process.env.NEXT_PUBLIC_PHONE}<br />
            Email : {process.env.NEXT_PUBLIC_EMAIL}
          </p>
          <h2 className="font-heading text-2xl text-charcoal">Hebergement</h2>
          <p>
            Ce site est heberge par Vercel Inc., 440 N Baxter St, Coppell, TX 75019, USA.
          </p>
          <h2 className="font-heading text-2xl text-charcoal">Propriete intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, videos) est la propriete
            exclusive d&apos;ETS Mme Jesus, sauf mention contraire. Toute reproduction
            sans autorisation prealable est interdite.
          </p>
          <h2 className="font-heading text-2xl text-charcoal">Responsabilite</h2>
          <p>
            ETS Mme Jesus s&apos;efforce de fournir des informations aussi precises que
            possible. Cependant, l&apos;entreprise ne saurait etre tenue responsable
            des omissions, inexactitudes ou defauts de mise a jour.
          </p>
        </div>
      </section>
    </>
  );
}
