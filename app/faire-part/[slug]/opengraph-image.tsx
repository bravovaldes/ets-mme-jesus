import { ImageResponse } from "next/og";
import { getFairePartBySlug } from "@/lib/fairepart-service";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Faire-part - ETS Mme Jesus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fp = await getFairePartBySlug(slug);

  if (!fp) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1F2E1F",
            color: "#F5F1E8",
            fontSize: 40,
            fontFamily: "serif",
          }}
        >
          Faire-part introuvable
        </div>
      ),
      { ...size }
    );
  }

  const design = fp.fairePartDesign;
  const mainPerson = fp.personnes[0];
  const secondPerson = fp.personnes[1];
  const isFunerailles =
    fp.eventType === "funerailles" || fp.eventType === "levee-de-deuil";
  const isMariage = fp.eventType.startsWith("mariage");

  const eventLabel =
    EVENT_TYPE_LABELS[fp.eventType as keyof typeof EVENT_TYPE_LABELS] ||
    fp.eventType;

  // Build display name
  let displayName = "";
  if (mainPerson) {
    displayName = mainPerson.titreHonorifique
      ? `${mainPerson.titreHonorifique} ${mainPerson.prenoms} ${mainPerson.nom}`
      : `${mainPerson.prenoms} ${mainPerson.nom}`;
  }
  if (secondPerson && isMariage) {
    displayName += ` & ${secondPerson.prenoms} ${secondPerson.nom}`;
  }

  // Build subtitle
  let subtitle = "";
  if (isFunerailles && mainPerson) {
    const parts: string[] = [];
    if (mainPerson.dateNaissance) parts.push(mainPerson.dateNaissance);
    if (mainPerson.dateDeces) parts.push(mainPerson.dateDeces);
    subtitle = parts.join(" - ");
  } else if (isMariage && fp.programme[0]) {
    subtitle = fp.programme[0].jour;
  }

  // Load font
  let fontData: ArrayBuffer;
  try {
    const fontPath = join(
      process.cwd(),
      "public/fonts/CormorantGaramond-SemiBold.ttf"
    );
    const buffer = await readFile(fontPath);
    fontData = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
  } catch {
    // Fallback — render without custom font
    fontData = new ArrayBuffer(0);
  }

  const fonts =
    fontData.byteLength > 0
      ? [
          {
            name: "Cormorant",
            data: fontData,
            weight: 600 as const,
            style: "normal" as const,
          },
        ]
      : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: design.primaryColor,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: design.accentColor,
          }}
        />

        {/* Decorative corner accents */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            width: 60,
            height: 60,
            borderTop: `2px solid ${design.accentColor}`,
            borderLeft: `2px solid ${design.accentColor}`,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderBottom: `2px solid ${design.accentColor}`,
            borderRight: `2px solid ${design.accentColor}`,
            opacity: 0.5,
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 60px",
          }}
        >
          {/* Event type badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 28px",
              border: `1px solid ${design.accentColor}`,
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: design.accentColor,
              marginBottom: 30,
            }}
          >
            {eventLabel}
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: 80,
              height: 1,
              backgroundColor: design.accentColor,
              marginBottom: 30,
              opacity: 0.6,
            }}
          />

          {/* Name */}
          <div
            style={{
              fontSize: isMariage ? 52 : 58,
              fontFamily: fonts.length > 0 ? "Cormorant" : "serif",
              color: design.backgroundColor,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {displayName}
          </div>

          {/* Dates / event date */}
          {subtitle && (
            <div
              style={{
                fontSize: 22,
                color: design.accentColor,
                marginTop: 20,
                fontFamily: fonts.length > 0 ? "Cormorant" : "serif",
                letterSpacing: 1,
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Decorative line */}
          <div
            style={{
              width: 80,
              height: 1,
              backgroundColor: design.accentColor,
              marginTop: 30,
              opacity: 0.6,
            }}
          />

          {/* Ville & Region */}
          {fp.ville && (
            <div
              style={{
                fontSize: 16,
                color: `${design.backgroundColor}80`,
                marginTop: 20,
                letterSpacing: 2,
              }}
            >
              {fp.ville}
              {fp.region ? `, ${fp.region}` : ""}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 40px",
            borderTop: `1px solid ${design.accentColor}30`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: `${design.backgroundColor}50`,
              letterSpacing: 1,
            }}
          >
            {fp.familleName}
          </div>
          <div
            style={{
              fontSize: 13,
              color: design.accentColor,
              letterSpacing: 1,
            }}
          >
            ETS Mme Jesus
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
