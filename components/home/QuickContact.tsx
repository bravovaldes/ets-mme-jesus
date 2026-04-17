"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function QuickContact() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "+1 418 490 1849";
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "14184901849";
  const email = process.env.NEXT_PUBLIC_EMAIL || "contact@etsmmejesus.com";
  const message = encodeURIComponent(
    "Bonjour, je vous contacte depuis votre site web."
  );

  return (
    <section className="bg-cream py-16 sm:py-24 lg:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-accent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-charcoal font-normal mb-4">
              Disponibles 24h/24, 7j/7
            </h2>
            <p className="text-muted mb-10 leading-relaxed">
              Un proche vient de deceder ? Vous preparez des obseques ?
              Contactez-nous immediatement, nous sommes la pour vous.
            </p>

            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 mb-6 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone size={20} className="text-primary" />
              </div>
              <span className="font-heading text-xl sm:text-2xl md:text-3xl text-charcoal">
                {phone}
              </span>
            </a>

            <Button
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              variant="whatsapp"
              external
              className="mb-6 w-full sm:w-auto"
            >
              <MessageCircle size={18} />
              Discuter sur WhatsApp
            </Button>

            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-muted hover:text-accent transition-colors"
            >
              <Mail size={18} />
              <span>{email}</span>
            </a>
          </motion.div>

          {/* Right: mini form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="bg-white p-5 sm:p-8 border border-border"
          >
            <h3 className="font-heading text-xl text-charcoal mb-6">
              Laissez-nous un message
            </h3>
            <form
              action="/contact"
              method="GET"
              className="space-y-4"
            >
              <div>
                <input
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 bg-cream border border-border text-charcoal placeholder:text-muted/60 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Votre telephone"
                  className="w-full px-4 py-3 bg-cream border border-border text-charcoal placeholder:text-muted/60 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Votre message"
                  className="w-full px-4 py-3 bg-cream border border-border text-charcoal placeholder:text-muted/60 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full py-3 bg-accent text-white text-sm tracking-wide hover:bg-accent-dark transition-colors"
              >
                Envoyer ma demande
              </Link>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
