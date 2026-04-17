"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import type { PaymentRecord } from "@/lib/types";

interface ContributionsListProps {
  fairePartId: string;
  contributionsTotal?: number;
  accentColor: string;
  primaryColor: string;
}

export default function ContributionsList({
  fairePartId,
  contributionsTotal,
  accentColor,
}: ContributionsListProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [total, setTotal] = useState(contributionsTotal || 0);

  useEffect(() => {
    if (!db) return;

    async function fetchPayments() {
      try {
        const q = query(
          collection(db!, "payments"),
          where("fairePartId", "==", fairePartId),
          where("status", "==", "completed"),
          orderBy("completedAt", "desc"),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const records = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as PaymentRecord)
        );
        setPayments(records);

        if (!contributionsTotal) {
          const sum = records.reduce((acc, r) => acc + r.amount, 0);
          setTotal(sum);
        }
      } catch {
        // Collection may not exist yet or permissions not configured
      }
    }

    fetchPayments();
  }, [fairePartId, contributionsTotal]);

  useEffect(() => {
    if (contributionsTotal) setTotal(contributionsTotal);
  }, [contributionsTotal]);

  const formatAmount = (n: number) =>
    new Intl.NumberFormat("fr-FR").format(n);

  if (payments.length === 0 && !total) return null;

  return (
    <div className="mt-6">
      {total > 0 && (
        <div
          className="text-center mb-4 py-3 border rounded"
          style={{ borderColor: `${accentColor}30` }}
        >
          <p className="text-cream/40 text-[10px] uppercase tracking-widest mb-1">
            Total des contributions en ligne
          </p>
          <p
            className="font-heading text-2xl"
            style={{ color: accentColor }}
          >
            {formatAmount(total)} FCFA
          </p>
        </div>
      )}

      {payments.length > 0 && (
        <div className="space-y-2">
          <p className="text-cream/30 text-[10px] uppercase tracking-widest">
            Contributions recentes
          </p>
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-2.5 py-2 border-b"
              style={{ borderColor: `${accentColor}10` }}
            >
              <Heart
                size={12}
                className="mt-0.5 shrink-0"
                style={{ color: accentColor }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-cream/80 text-xs truncate">
                    {p.isAnonymous ? "Anonyme" : p.donorName}
                  </span>
                  <span
                    className="text-xs font-heading shrink-0"
                    style={{ color: accentColor }}
                  >
                    {formatAmount(p.amount)} FCFA
                  </span>
                </div>
                {p.message && (
                  <p className="text-cream/40 text-[10px] mt-0.5 leading-snug">
                    {p.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
