import { z } from "zod";

export const contactFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  telephone: z
    .string()
    .regex(
      /^(\+237|237)?[ ]?[2-9]\d{7,8}$|^(\+1|1)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{4}$/,
      "Numero de telephone invalide"
    ),
  email: z
    .string()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")),
  typeCeremonie: z.string().min(1, "Veuillez selectionner un type de ceremonie"),
  datePrevue: z.string().min(1, "Veuillez indiquer une date"),
  lieu: z.string().min(2, "Veuillez indiquer la ville ou la region"),
  nombreInvites: z.string().min(1, "Veuillez selectionner une tranche"),
  services: z
    .array(z.string())
    .min(1, "Veuillez selectionner au moins un service"),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const typeCeremonieOptions = [
  "Obseques completes",
  "Veillee uniquement",
  "Reception",
  "Levee de deuil",
  "Autre",
];

export const nombreInvitesOptions = [
  "Moins de 100",
  "100 - 300",
  "300 - 500",
  "500 - 1000",
  "Plus de 1000",
];

export const servicesOptions = [
  "Organisation complete",
  "Decoration",
  "Location materiel",
  "Traiteur",
  "Impression",
  "Transport",
  "Autre",
];

export const budgetOptions = [
  "Moins de 2 000 000 FCFA",
  "2 000 000 - 5 000 000 FCFA",
  "5 000 000 - 10 000 000 FCFA",
  "10 000 000 - 20 000 000 FCFA",
  "Plus de 20 000 000 FCFA",
  "A definir ensemble",
];

// Payment validation
export const paymentInitSchema = z.object({
  fairePartId: z.string().min(1, "Faire-part requis"),
  amount: z.number().min(100, "Montant minimum : 100 FCFA"),
  donorName: z.string().min(2, "Nom requis"),
  donorPhone: z.string().optional(),
  message: z.string().max(200).optional(),
  isAnonymous: z.boolean().default(false),
});

export type PaymentInitData = z.infer<typeof paymentInitSchema>;
