import { NextResponse } from "next/server";
import { paymentInitSchema } from "@/lib/validators";
import { initializePayment, generateTransactionId } from "@/lib/cinetpay";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentInitSchema.parse(body);

    const transactionId = generateTransactionId(parsed.fairePartId);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://etsmmejesus.com";

    const result = await initializePayment({
      transaction_id: transactionId,
      amount: parsed.amount,
      currency: "XAF",
      description: `Contribution faire-part ${parsed.fairePartId}`,
      customer_name: parsed.isAnonymous ? "Anonyme" : parsed.donorName,
      customer_phone_number: parsed.donorPhone,
      return_url: `${siteUrl}/faire-part/${parsed.fairePartId}?payment=done&tx=${transactionId}`,
      notify_url: `${siteUrl}/api/payments/webhook`,
      channels: "ALL",
      metadata: JSON.stringify({
        fairePartId: parsed.fairePartId,
        donorName: parsed.donorName,
        message: parsed.message,
        isAnonymous: parsed.isAnonymous,
      }),
    });

    // Store pending payment in Firestore
    if (db) {
      const paymentRef = doc(collection(db, "payments"), transactionId);
      await setDoc(paymentRef, {
        fairePartId: parsed.fairePartId,
        transactionId,
        amount: parsed.amount,
        currency: "XAF",
        donorName: parsed.donorName,
        donorPhone: parsed.donorPhone || null,
        message: parsed.message || null,
        isAnonymous: parsed.isAnonymous,
        status: "pending",
        createdAt: serverTimestamp(),
      });
    }

    return NextResponse.json({
      payment_url: result.data.payment_url,
      transaction_id: transactionId,
    });
  } catch (error) {
    console.error("Payment init error:", error);

    if (error instanceof Error && error.message.includes("not configured")) {
      return NextResponse.json(
        { error: "Service de paiement non configure" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement" },
      { status: 500 }
    );
  }
}
