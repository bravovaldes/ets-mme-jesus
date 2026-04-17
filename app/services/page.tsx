import type { Metadata } from "next";
import ServiceSection from "@/components/services/ServiceSection";
import Process from "@/components/services/Process";
import Button from "@/components/ui/Button";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Organisation complete des obseques, decoration, location de materiel, traiteur, transport et plus. ETS Mme Jesus a Dschang.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-normal mb-6">
            Nos services
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Une prise en charge complete, adaptable a chaque famille et a chaque
            tradition.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-cream py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
          {services.map((service, index) => (
            <ServiceSection
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              includes={service.includes}
              icon={service.icon}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Process */}
      <Process />

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-cream mb-4">
            Un proche vient de deceder ?
          </h2>
          <p className="text-cream/70 mb-8">
            Nous sommes disponibles des maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "14184901849"}?text=${encodeURIComponent("Bonjour, je vous contacte depuis votre site web.")}`}
              variant="whatsapp"
              external
            >
              WhatsApp
            </Button>
            <Button href="/contact" variant="outline">
              Demander un devis
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
