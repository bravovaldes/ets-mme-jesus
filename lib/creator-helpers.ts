import type {
  FairePartPage,
  EventType,
  FairePartDesign,
  PersonneConcernee,
  FamilleGroupe,
  ProgrammeJour,
  ContactFamille,
} from "./types";
import { DEFAULT_DESIGNS } from "./types";

export function getDesignForType(eventType: EventType): FairePartDesign {
  switch (eventType) {
    case "funerailles":
      return DEFAULT_DESIGNS["funerailles-bamileke"];
    case "levee-de-deuil":
      return DEFAULT_DESIGNS["levee-deuil"];
    case "mariage-traditionnel":
      return DEFAULT_DESIGNS["mariage-traditionnel"];
    case "mariage-civil":
    case "mariage-religieux":
      return DEFAULT_DESIGNS["mariage-classique"];
    case "bapteme":
      return DEFAULT_DESIGNS["bapteme"];
    default:
      return DEFAULT_DESIGNS["funerailles-classique"];
  }
}

export function createEmptyPerson(): PersonneConcernee {
  return {
    nom: "",
    prenoms: "",
    photoPortrait: "/images/fondatrice.jpg",
  };
}

export function createEmptyFamilleGroupe(): FamilleGroupe {
  return {
    categorie: "enfants",
    membres: [],
  };
}

export function createEmptyJour(): ProgrammeJour {
  return {
    id: crypto.randomUUID(),
    jour: "",
    evenements: [{ heure: "", titre: "", lieu: "" }],
  };
}

export function createEmptyContact(): ContactFamille {
  return { nom: "", telephone: "", ville: "", role: "" };
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

export function createEmptyFairePart(eventType: EventType): Partial<FairePartPage> {
  const isFunerailles = eventType === "funerailles" || eventType === "levee-de-deuil";
  const isMariage = eventType.startsWith("mariage");

  return {
    eventType,
    titre: isFunerailles
      ? "Faire-part de deces et de funerailles"
      : isMariage
        ? "Invitation au mariage"
        : eventType === "bapteme"
          ? "Faire-part de bapteme"
          : "Invitation",
    sousTitre: "",
    personnes: isMariage
      ? [createEmptyPerson(), createEmptyPerson()]
      : [createEmptyPerson()],
    famille: [],
    programme: [createEmptyJour()],
    photos: [],
    contactsFamille: [createEmptyContact()],
    contactOrganisateur: "+1 418 490 1849",
    isPrivate: false,
    isPublished: false,
    isPending: true,
    allowCondolences: true,
    allowPhotoDownload: true,
    ville: "",
    region: "Ouest",
    familleName: "",
    coverImage: "",
    fairePartDesign: getDesignForType(eventType),
    symboleReligieux: "croix",
  };
}

export const STEPS = [
  { id: 1, title: "Type et modele", shortTitle: "Type" },
  { id: 2, title: "Personnes concernees", shortTitle: "Personnes" },
  { id: 3, title: "La famille", shortTitle: "Famille" },
  { id: 4, title: "Programme", shortTitle: "Programme" },
  { id: 5, title: "Infos et contributions", shortTitle: "Infos" },
  { id: 6, title: "Apercu et envoi", shortTitle: "Apercu" },
];
