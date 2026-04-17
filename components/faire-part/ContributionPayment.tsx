"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Loader2, CreditCard } from "lucide-react";

interface ContributionPaymentProps {
  fairePartId: string;
  accentColor: string;
  primaryColor: string;
  onClose: () => void;
}

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

export default function ContributionPayment({
  fairePartId,
  accentColor,
  primaryColor,
  onClose,
}: ContributionPaymentProps) {
  const [amount, setAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = isCustom ? Number(customAmount) : amount;

  const handleSubmit = async () => {
    if (!donorName.trim() && !isAnonymous) {
      setError("Veuillez entrer votre nom");
      return;
    }
    if (!finalAmount || finalAmount < 100) {
      setError("Montant minimum : 100 FCFA");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fairePartId,
          amount: finalAmount,
          donorName: isAnonymous ? "Anonyme" : donorName.trim(),
          donorPhone: donorPhone.trim() || undefined,
          message: message.trim() || undefined,
          isAnonymous,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du paiement");
      }

      // Redirect to CinetPay checkout
      window.location.href = data.payment_url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du paiement"
      );
      setLoading(false);
    }
  };

  const formatAmount = (n: number) =>
    new Intl.NumberFormat("fr-FR").format(n);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-2">
              <Heart size={18} style={{ color: accentColor }} />
              <h3
                className="font-heading text-lg"
                style={{ color: accentColor }}
              >
                Contribuer
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Amount selection */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                Montant (FCFA)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAmount(a);
                      setIsCustom(false);
                    }}
                    className="py-2.5 text-sm font-medium rounded-lg border-2 transition-all"
                    style={
                      !isCustom && amount === a
                        ? {
                            borderColor: accentColor,
                            backgroundColor: `${accentColor}10`,
                            color: primaryColor,
                          }
                        : {
                            borderColor: "#e5e7eb",
                            color: "#6b7280",
                          }
                    }
                  >
                    {formatAmount(a)}
                  </button>
                ))}
                <button
                  onClick={() => setIsCustom(true)}
                  className="py-2.5 text-sm font-medium rounded-lg border-2 transition-all"
                  style={
                    isCustom
                      ? {
                          borderColor: accentColor,
                          backgroundColor: `${accentColor}10`,
                          color: primaryColor,
                        }
                      : {
                          borderColor: "#e5e7eb",
                          color: "#6b7280",
                        }
                  }
                >
                  Autre
                </button>
              </div>
              {isCustom && (
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Montant en FCFA"
                  min={100}
                  className="mt-2 w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={
                    {
                      "--tw-ring-color": accentColor,
                      borderColor: "#e5e7eb",
                    } as React.CSSProperties
                  }
                />
              )}
            </div>

            {/* Donor info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                  style={{ accentColor }}
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm text-gray-600"
                >
                  Rester anonyme
                </label>
              </div>

              {!isAnonymous && (
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={
                    { "--tw-ring-color": accentColor } as React.CSSProperties
                  }
                />
              )}

              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="Telephone (optionnel) — ex: 699 12 34 56"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Un mot pour la famille (optionnel)"
                rows={2}
                maxLength={200}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CreditCard size={18} />
              )}
              {loading
                ? "Redirection..."
                : `Contribuer ${formatAmount(finalAmount)} FCFA`}
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              Paiement securise par CinetPay. Orange Money, MTN MoMo, Visa/Mastercard.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
