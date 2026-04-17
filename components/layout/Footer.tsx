import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Realisations" },
  { href: "/services", label: "Services" },
  { href: "/faire-part", label: "Faire-parts" },
  { href: "/simulateur", label: "Simulateur de devis" },
  { href: "/guide-demarches", label: "Guide des demarches" },
  { href: "/a-propos", label: "A propos" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services#organisation-complete", label: "Organisation complete" },
  { href: "/services#decoration-amenagement", label: "Decoration" },
  { href: "/services#location-materiel", label: "Location materiel" },
  { href: "/services#coordination-traiteur", label: "Traiteur" },
  { href: "/services#transport", label: "Transport" },
  { href: "/services#levee-de-deuil", label: "Levee de deuil" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-cream">
      <div className="w-full h-px bg-accent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Column 1: Logo + pitch */}
          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-4">
              ETS Mme Jesus
            </h3>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Accompagner vos adieux avec dignite. Nous organisons des
              ceremonies funebres a la hauteur de la memoire de vos proches,
              dans le respect des traditions camerounaises.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/60 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/60 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">
              Nos services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-accent mt-0.5 shrink-0" />
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_PHONE?.replace(/\s/g, "")}`}
                  className="text-cream/70 text-sm hover:text-accent transition-colors"
                >
                  {process.env.NEXT_PUBLIC_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-accent mt-0.5 shrink-0" />
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="text-cream/70 text-sm hover:text-accent transition-colors"
                >
                  {process.env.NEXT_PUBLIC_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                <span className="text-cream/70 text-sm">
                  {process.env.NEXT_PUBLIC_ADDRESS}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/50 text-xs">
            &copy; {year} ETS Mme Jesus. Tous droits reserves.
          </p>
          <div className="flex gap-6">
            <Link
              href="/mentions-legales"
              className="text-cream/50 text-xs hover:text-accent transition-colors"
            >
              Mentions legales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-cream/50 text-xs hover:text-accent transition-colors"
            >
              Politique de confidentialite
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
