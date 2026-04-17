import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import ScrollToTop from "@/components/layout/ScrollToTop";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ETS Mme Jesus | Evenementiel funeraire - Dschang, Cameroun",
    template: "%s | ETS Mme Jesus",
  },
  description:
    "ETS Mme Jesus vous accompagne dans l'organisation d'obseques, de veillees funebres et de levees de deuil a Dschang et dans l'Ouest Cameroun. Service disponible 24h/24.",
  keywords: [
    "obseques cameroun",
    "funerailles dschang",
    "evenementiel funeraire",
    "veillee funebre",
    "levee de deuil",
    "organisation obseques",
    "ETS Mme Jesus",
  ],
  openGraph: {
    title: "ETS Mme Jesus | Evenementiel funeraire",
    description:
      "Accompagner vos adieux avec dignite. Organisation d'obseques, veillees et levees de deuil a Dschang, Cameroun.",
    type: "website",
    locale: "fr_CM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "ETS Mme Jesus",
              description:
                "Organisation d'obseques, veillees funebres et levees de deuil",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dschang",
                addressCountry: "CM",
              },
              telephone: process.env.NEXT_PUBLIC_PHONE,
              email: process.env.NEXT_PUBLIC_EMAIL,
              openingHours: "Mo-Su 00:00-23:59",
              areaServed: "Ouest Cameroun",
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </body>
    </html>
  );
}
