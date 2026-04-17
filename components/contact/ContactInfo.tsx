import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";

export default function ContactInfo() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "+1 418 490 1849";
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "14184901849";
  const email = process.env.NEXT_PUBLIC_EMAIL || "contact@etsmmejesus.com";
  const address = process.env.NEXT_PUBLIC_ADDRESS || "Dschang, Cameroun";
  const message = encodeURIComponent(
    "Bonjour, je vous contacte depuis votre site web."
  );

  return (
    <div className="space-y-8">
      {/* Urgence */}
      <div className="border-2 border-accent p-6">
        <h3 className="font-heading text-xl text-charcoal mb-4">
          Urgence &mdash; contactez-nous immediatement
        </h3>

        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="block mb-4"
        >
          <span className="font-heading text-2xl sm:text-3xl text-charcoal hover:text-accent transition-colors break-all sm:break-normal">
            {phone}
          </span>
        </a>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-3 bg-whatsapp text-white text-sm tracking-wide hover:brightness-110 transition-all mb-4"
        >
          <MessageCircle size={18} />
          Discuter sur WhatsApp
        </a>

        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm"
        >
          <Mail size={16} />
          {email}
        </a>
      </div>

      {/* Bureau */}
      <div className="border border-border p-6">
        <h3 className="font-heading text-xl text-charcoal mb-4">
          Notre bureau
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
            <span className="text-charcoal/80 text-sm">{address}</span>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-accent mt-0.5 shrink-0" />
            <div className="text-charcoal/80 text-sm">
              <p>Lundi - Samedi : 8h00 - 18h00</p>
              <p className="text-accent text-xs mt-1">
                Service d&apos;urgence disponible 24h/24
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="aspect-[4/3] bg-primary/5 border border-border flex items-center justify-center">
        <div className="text-center text-muted text-sm">
          <MapPin size={32} className="mx-auto mb-2 text-accent/30" />
          <p>Carte Google Maps</p>
          <p className="text-xs">(a configurer avec l&apos;adresse exacte)</p>
        </div>
      </div>
    </div>
  );
}
