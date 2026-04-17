"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Realisations" },
  { href: "/services", label: "Services" },
  { href: "/faire-part", label: "Faire-parts" },
  { href: "/a-propos", label: "A propos" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const showTransparent = isHome && !scrolled;
  const isFairePartDetail = pathname.startsWith("/faire-part/") && pathname !== "/faire-part";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isFairePartDetail && !scrolled ? "bg-transparent" : ""
        } ${
          isFairePartDetail && scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-sm"
            : ""
        } ${
          !isFairePartDetail && showTransparent
            ? "bg-transparent"
            : !isFairePartDetail
              ? "bg-cream/95 backdrop-blur-md shadow-sm"
              : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col">
              <span
                className={`font-heading text-lg lg:text-xl font-semibold tracking-wide transition-colors duration-500 ${
                  showTransparent || (isFairePartDetail && !scrolled) ? "text-cream" : "text-charcoal"
                }`}
              >
                ETS Mme Jesus
              </span>
              <span
                className={`text-[9px] lg:text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                  showTransparent || (isFairePartDetail && !scrolled) ? "text-cream/70" : "text-muted"
                }`}
              >
                Evenementiel funeraire
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors duration-300 ${
                    pathname === link.href
                      ? showTransparent
                        ? "text-accent-light"
                        : "text-accent"
                      : showTransparent
                        ? "text-cream/90 hover:text-cream"
                        : "text-charcoal/80 hover:text-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/creer-faire-part"
                className={`text-sm tracking-wide px-6 py-2.5 border transition-all duration-300 ${
                  showTransparent
                    ? "border-cream/50 text-cream hover:bg-cream/10"
                    : "border-accent text-accent hover:bg-accent hover:text-white"
                }`}
              >
                Creer un faire-part
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2 transition-colors ${
                showTransparent || (isFairePartDetail && !scrolled) ? "text-cream" : "text-charcoal"
              }`}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-[75vw] max-w-72 bg-cream z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-heading text-base font-semibold text-charcoal">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-charcoal"
                  aria-label="Fermer le menu"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col p-5 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-heading py-1.5 ${
                      pathname === link.href
                        ? "text-accent"
                        : "text-charcoal"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/creer-faire-part"
                  className="mt-3 text-center py-3 bg-accent text-white text-sm tracking-wide rounded-lg"
                >
                  Creer un faire-part
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
