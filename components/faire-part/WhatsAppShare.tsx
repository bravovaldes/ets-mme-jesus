"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Send, Loader2, CheckCircle } from "lucide-react";

interface WhatsAppShareProps {
  fairePartSlug: string;
  fairePartTitle: string;
  personName: string;
  accentColor: string;
  primaryColor: string;
  onClose: () => void;
}

export default function WhatsAppShare({
  fairePartSlug,
  fairePartTitle,
  personName,
  accentColor,
  primaryColor,
  onClose,
}: WhatsAppShareProps) {
  const [senderName, setSenderName] = useState("");
  const [recipients, setRecipients] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
  } | null>(null);

  const addRecipient = () => {
    if (recipients.length < 10) {
      setRecipients([...recipients, ""]);
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, value: string) => {
    const updated = [...recipients];
    updated[index] = value;
    setRecipients(updated);
  };

  const handleSend = async () => {
    const validRecipients = recipients.filter((r) => r.trim().length >= 8);
    if (!senderName.trim()) {
      setError("Veuillez entrer votre nom");
      return;
    }
    if (validRecipients.length === 0) {
      setError("Veuillez entrer au moins un numero");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/whatsapp/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fairePartSlug,
          fairePartTitle,
          personName,
          senderName: senderName.trim(),
          recipients: validRecipients,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setResult({ sent: data.sent, failed: data.failed });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="px-5 py-4 flex items-center justify-between bg-[#25D366]">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <h3 className="text-white font-medium">
                Envoyer par WhatsApp
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {result ? (
              /* Success state */
              <div className="text-center py-6 space-y-3">
                <CheckCircle
                  size={48}
                  className="mx-auto"
                  style={{ color: "#25D366" }}
                />
                <p className="font-medium" style={{ color: primaryColor }}>
                  {result.sent} message{result.sent > 1 ? "s" : ""} envoye
                  {result.sent > 1 ? "s" : ""}
                </p>
                {result.failed > 0 && (
                  <p className="text-sm text-red-500">
                    {result.failed} echec{result.failed > 1 ? "s" : ""}
                  </p>
                )}
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2 text-sm text-white rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                {/* Preview */}
                <div
                  className="p-3 rounded-lg text-xs leading-relaxed"
                  style={{
                    backgroundColor: `${primaryColor}08`,
                    color: `${primaryColor}90`,
                  }}
                >
                  <p className="font-medium mb-1">Apercu du message :</p>
                  <p className="italic">
                    &quot;Bonjour, {senderName || "[votre nom]"} vous partage
                    le faire-part de {personName}. Consultez-le ici :
                    etsmmejesus.com/faire-part/{fairePartSlug}&quot;
                  </p>
                </div>

                {/* Sender name */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ex: Jean Tchinda"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={
                      {
                        "--tw-ring-color": "#25D366",
                      } as React.CSSProperties
                    }
                  />
                </div>

                {/* Recipients */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                    Destinataires (max 10)
                  </label>
                  <div className="space-y-2">
                    {recipients.map((phone, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 shrink-0 w-8">
                          +237
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => updateRecipient(i, e.target.value)}
                          placeholder="699 12 34 56"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                          style={
                            {
                              "--tw-ring-color": "#25D366",
                            } as React.CSSProperties
                          }
                        />
                        {recipients.length > 1 && (
                          <button
                            onClick={() => removeRecipient(i)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {recipients.length < 10 && (
                    <button
                      onClick={addRecipient}
                      className="flex items-center gap-1 mt-2 text-xs hover:underline"
                      style={{ color: accentColor }}
                    >
                      <Plus size={14} />
                      Ajouter un destinataire
                    </button>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {loading ? "Envoi en cours..." : "Envoyer"}
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                  Necessite un compte WhatsApp Business configure. Les
                  templates doivent etre approuves par Meta.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
