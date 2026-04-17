"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  contactFormSchema,
  type ContactFormData,
  typeCeremonieOptions,
  nombreInvitesOptions,
  servicesOptions,
  budgetOptions,
} from "@/lib/validators";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const prefilledService = searchParams.get("service") || "";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      services: prefilledService ? [prefilledService] : [],
    },
  });

  async function onSubmit(data: ContactFormData) {
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      setSubmitted(true);
    } catch {
      setError(
        "Une erreur est survenue. Veuillez reessayer ou nous contacter par telephone."
      );
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-charcoal mb-4">
          Votre demande a bien ete recue
        </h3>
        <p className="text-muted leading-relaxed">
          Nous vous contacterons sous une heure. En cas d&apos;urgence,
          n&apos;hesitez pas a nous appeler directement.
        </p>
      </div>
    );
  }

  const inputStyles =
    "w-full px-4 py-3 bg-cream border border-border text-charcoal placeholder:text-muted/60 text-sm focus:outline-none focus:border-accent transition-colors";
  const labelStyles = "block text-sm text-charcoal mb-2";
  const errorStyles = "text-red-600 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nom */}
      <div>
        <label className={labelStyles}>Votre nom complet *</label>
        <input
          type="text"
          {...register("nom")}
          className={inputStyles}
          placeholder="Ex: Jean Tchuente"
        />
        {errors.nom && <p className={errorStyles}>{errors.nom.message}</p>}
      </div>

      {/* Telephone */}
      <div>
        <label className={labelStyles}>Telephone *</label>
        <input
          type="tel"
          {...register("telephone")}
          className={inputStyles}
          placeholder="Ex: +237 699 12 34 56"
        />
        {errors.telephone && (
          <p className={errorStyles}>{errors.telephone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className={labelStyles}>Email (optionnel)</label>
        <input
          type="email"
          {...register("email")}
          className={inputStyles}
          placeholder="Ex: jean@email.com"
        />
        {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
      </div>

      {/* Type ceremonie */}
      <div>
        <label className={labelStyles}>Type de ceremonie *</label>
        <select {...register("typeCeremonie")} className={inputStyles}>
          <option value="">Selectionnez...</option>
          {typeCeremonieOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.typeCeremonie && (
          <p className={errorStyles}>{errors.typeCeremonie.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className={labelStyles}>Date prevue *</label>
        <input type="date" {...register("datePrevue")} className={inputStyles} />
        {errors.datePrevue && (
          <p className={errorStyles}>{errors.datePrevue.message}</p>
        )}
      </div>

      {/* Lieu */}
      <div>
        <label className={labelStyles}>Ville / Region *</label>
        <input
          type="text"
          {...register("lieu")}
          className={inputStyles}
          placeholder="Ex: Dschang"
        />
        {errors.lieu && <p className={errorStyles}>{errors.lieu.message}</p>}
      </div>

      {/* Nombre invites */}
      <div>
        <label className={labelStyles}>Nombre d&apos;invites *</label>
        <select {...register("nombreInvites")} className={inputStyles}>
          <option value="">Selectionnez...</option>
          {nombreInvitesOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.nombreInvites && (
          <p className={errorStyles}>{errors.nombreInvites.message}</p>
        )}
      </div>

      {/* Services */}
      <div>
        <label className={labelStyles}>Services souhaites *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {servicesOptions.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                value={opt}
                {...register("services")}
                className="accent-accent"
              />
              {opt}
            </label>
          ))}
        </div>
        {errors.services && (
          <p className={errorStyles}>{errors.services.message}</p>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className={labelStyles}>Budget (optionnel)</label>
        <select {...register("budget")} className={inputStyles}>
          <option value="">Selectionnez...</option>
          {budgetOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label className={labelStyles}>
          Demandes particulieres ou traditions a respecter
        </label>
        <textarea
          {...register("message")}
          rows={4}
          className={`${inputStyles} resize-none`}
          placeholder="Precisez ici toute demande particuliere..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="accent"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </Button>
    </form>
  );
}
