import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/cinetpay";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transactionId = body.cpm_trans_id;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    // Verify payment with CinetPay
    const verification = await verifyPayment(transactionId);

    if (!db) {
      console.log("Webhook received (no DB):", verification);
      return NextResponse.json({ status: "ok" });
    }

    // Update payment record
    const paymentRef = doc(db, "payments", transactionId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      console.error("Payment record not found:", transactionId);
      return NextResponse.json({ status: "ok" });
    }

    const paymentData = paymentSnap.data();

    if (verification.data.status === "ACCEPTED") {
      // Mark payment as completed
      await updateDoc(paymentRef, {
        status: "completed",
        paymentMethod: verification.data.payment_method,
        completedAt: serverTimestamp(),
      });

      // Increment total on faire-part
      const fpRef = doc(db, "faireParts", paymentData.fairePartId);
      await updateDoc(fpRef, {
        contributionsTotal: increment(Number(verification.data.amount)),
      });
    } else {
      // Mark payment as failed
      await updateDoc(paymentRef, {
        status: "failed",
        completedAt: serverTimestamp(),
      });
    }

    // CinetPay expects a 200 response
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    // Still return 200 to prevent CinetPay from retrying indefinitely
    return NextResponse.json({ status: "ok" });
  }
}
