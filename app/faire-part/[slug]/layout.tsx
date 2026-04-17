import type { Metadata } from "next";
import { getFairePartBySlug } from "@/lib/fairepart-service";
import { EVENT_TYPE_LABELS } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fp = await getFairePartBySlug(slug);

  if (!fp) {
    return {
      title: "Faire-part introuvable | ETS Mme Jesus",
    };
  }

  const mainPerson = fp.personnes[0];
  const secondPerson = fp.personnes[1];
  const isMariage = fp.eventType.startsWith("mariage");
  const eventLabel =
    EVENT_TYPE_LABELS[fp.eventType as keyof typeof EVENT_TYPE_LABELS] ||
    fp.eventType;

  let displayName = "";
  if (mainPerson) {
    displayName = mainPerson.titreHonorifique
      ? `${mainPerson.titreHonorifique} ${mainPerson.prenoms} ${mainPerson.nom}`
      : `${mainPerson.prenoms} ${mainPerson.nom}`;
  }
  if (secondPerson && isMariage) {
    displayName += ` & ${secondPerson.prenoms} ${secondPerson.nom}`;
  }

  const title = `${eventLabel} — ${displayName} | ETS Mme Jesus`;
  const description =
    fp.sousTitre ||
    `${eventLabel} de ${displayName}. ${fp.ville ? `${fp.ville}, Cameroun.` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "ETS Mme Jesus",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function FairePartSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
