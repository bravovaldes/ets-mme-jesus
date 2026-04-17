"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Image, Headset, BookOpen, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Realisations" },
  { href: "/services", label: "Services" },
  { href: "/faire-part", label: "Faire-parts" },
  { href: "/a-propos", label: "A propos" },
  { href: "/contact", label: "Contact" },
];

// Bottom tab bar links for mobile — most important pages
const mobileTabLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/faire-part", label: "Faire-parts", icon: BookOpen },
  { href: "/creer-faire-part", label: "Creer", icon: Plus, isCta: true },
  { href: "/realisations", label: "Galerie", icon: Image },
  { href: "/contact", label: "Contact", icon: Headset },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMoreOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const showTransparent = isHome && !scrolled;

  // Check if current path is in the faire-part detail page (hide top bar on mobile)
  const isFairePartDetail = pathname.startsWith("/faire-part/") && pathname !== "/faire-part";

  return (
    <>
      {/* ===== TOP NAVBAR (desktop always, mobile only on non-detail pages) ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isFairePartDetail ? "hidden lg:block" : ""
        } ${
          showTransparent
            ? "bg-transparent"
            : "bg-cream/95 backdrop-blur-md shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col">
              <span
                className={`font-heading text-lg lg:text-xl font-semibold tracking-wide transition-colors duration-500 ${
                  showTransparent ? "text-cream" : "text-charcoal"
                }`}
              >
                ETS Mme Jesus
              </span>
              <span
                className={`text-[9px] lg:text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                  showTransparent ? "text-cream/70" : "text-muted"
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

            {/* Mobile — secondary menu button for less-used pages */}
            <button
              onClick={() => setMobileMoreOpen(true)}
              className={`lg:hidden p-2 transition-colors ${
                showTransparent ? "text-cream" : "text-charcoal"
              }`}
              aria-label="Plus de pages"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE BOTTOM TAB BAR (hidden on faire-part detail) ===== */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-border safe-area-bottom ${isFairePartDetail ? "hidden" : ""}`}>
        <div className="flex items-stretch">
          {mobileTabLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

            if (tab.isCta) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex-1 flex flex-col items-center justify-center py-1.5 -mt-3"
                >
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center shadow-lg">
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-[9px] mt-0.5 text-accent font-medium">
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
              >
                <Icon
                  size={20}
                  className={isActive ? "text-accent" : "text-muted"}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
                <span
                  className={`text-[9px] ${
                    isActive ? "text-accent font-medium" : "text-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===== MOBILE "MORE" SLIDE-IN (for secondary pages) ===== */}
      <AnimatePresence>
        {mobileMoreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setMobileMoreOpen(false)}
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
                  onClick={() => setMobileMoreOpen(false)}
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
