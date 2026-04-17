import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validators";
import { generateEmailHtml } from "@/lib/email-template";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactFormSchema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("RESEND_API_KEY not set — logging email instead:");
      console.log(JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "contact@etsmmejesus.com",
      to: process.env.RESEND_TO_EMAIL || "contact@etsmmejesus.com",
      subject: `Nouvelle demande de devis — ${data.typeCeremonie} — ${data.nom}`,
      html: generateEmailHtml(data),
      replyTo: data.email || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 }
    );
  }
}
