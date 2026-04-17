import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTemplateMessage, TEMPLATES } from "@/lib/whatsapp";

const shareSchema = z.object({
  fairePartSlug: z.string().min(1),
  fairePartTitle: z.string().min(1),
  personName: z.string().min(1),
  senderName: z.string().min(1),
  recipients: z
    .array(z.string().min(8))
    .min(1, "Au moins un destinataire")
    .max(10, "Maximum 10 destinataires"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = shareSchema.parse(body);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://etsmmejesus.com";
    const fairePartUrl = `${siteUrl}/faire-part/${parsed.fairePartSlug}`;

    const results = await Promise.allSettled(
      parsed.recipients.map((phone) =>
        sendTemplateMessage(phone, TEMPLATES.FAIRE_PART_SHARE, "fr", {
          sender_name: parsed.senderName,
          person_name: parsed.personName,
          title: parsed.fairePartTitle,
          link: fairePartUrl,
        })
      )
    );

    const sent = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - sent;

    return NextResponse.json({ sent, failed, total: results.length });
  } catch (error) {
    console.error("WhatsApp share error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Donnees invalides", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}
