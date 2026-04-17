// ============================================
// Types d'evenements supportes
// ============================================
export type EventType =
  | "funerailles"
  | "mariage-traditionnel"
  | "mariage-civil"
  | "mariage-religieux"
  | "levee-de-deuil"
  | "bapteme"
  | "autre";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  funerailles: "Funerailles",
  "mariage-traditionnel": "Mariage traditionnel (Dot)",
  "mariage-civil": "Mariage civil",
  "mariage-religieux": "Mariage religieux",
  "levee-de-deuil": "Levee de deuil",
  bapteme: "Bapteme",
  autre: "Evenement",
};

// ============================================
// Faire-part / Page hommage
// ============================================
export interface FairePartPage {
  id: string;
  slug: string;
  eventType: EventType;

  // En-tete
  titre: string;
  sousTitre: string; // Formule d'annonce principale
  versetBiblique?: string; // "A Dieu va!", verset, sourate
  proverbeTraditionnel?: string; // Proverbe bamileke ou africain
  symboleReligieux?: "croix" | "croissant" | "aucun";

  // Personne(s) concernee(s)
  personnes: PersonneConcernee[];

  // Famille
  famille: FamilleGroupe[];

  // Programme
  programme: ProgrammeJour[];

  // Video recap principale (YouTube URL ou Firebase URL)
  recapVideoUrl?: string;
  recapVideoTitle?: string; // "Recap complet de la ceremonie"

  // Dot (mariage traditionnel uniquement)
  dotItems?: DotItem[];

  // Temoins (mariage civil/religieux)
  temoins?: Temoin[];

  // Photos du faire-part (visuels de design, choisies par le createur)
  fairePartPhotos?: MediaItem[];

  // Album souvenir (photos/videos de la ceremonie, ajoutees par la famille et les invites)
  photos: MediaItem[];

  // Textes
  epitaphe?: string;
  biographie?: string;
  messageInvitation?: string;
  remerciements?: string; // "La famille remercie..."

  // Infos pratiques
  contactsFamille: ContactFamille[];
  contactOrganisateur: string;
  adresseReception?: string;
  coordonneesGPS?: { lat: number; lng: number };
  codeVestimentaire?: string; // "Tenue de deuil blanche"
  pagneInfo?: string; // "Pagne du mariage disponible chez Mme X au 699..."
  infoHebergement?: string;
  infoTransport?: string;
  celebrant?: string; // "Abbe Pierre Ngounou"
  comiteOrganisation?: string[];
  successeur?: string; // Levee de deuil: nom du successeur designe
  listeMaraigeUrl?: string; // Lien vers liste de mariage

  // Contributions financieres
  contributions?: ContributionInfo;

  // Parametres
  isPrivate: boolean;
  accessCode?: string;
  isPublished: boolean;
  isPending: boolean; // En attente d'approbation admin
  allowCondolences: boolean;
  allowPhotoDownload: boolean;
  contributionsTotal?: number; // Total contributions en ligne recues

  // Meta
  familleName: string;
  ville: string;
  region: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // email du createur

  // Design
  fairePartDesign: FairePartDesign;
}

// ============================================
// Personne concernee (defunt, marie, enfant baptise)
// ============================================
export interface PersonneConcernee {
  nom: string;
  prenoms: string;
  sexe?: "homme" | "femme"; // Pour adapter les textes (il/elle, feu/feue, pere/mere)
  titreHonorifique?: string; // "Feu", "Feue", "Papa", "Maman", "Sa Majeste", "Fo", "Mafo", "Nde"
  surnom?: string;
  dateNaissance?: string;
  dateDeces?: string;
  lieuNaissance?: string;
  lieuDeces?: string;
  ageAuDeces?: number;
  causeDecesMention?: string; // "des suites d'une longue maladie courageusement supportee"
  photoPortrait: string;
  photoJeunesse?: string; // 2e photo optionnelle
  profession?: string;
  gradeOuFonction?: string; // "Colonel (ER)", "Inspecteur general"
  titreTradi?: string; // "Notable du groupement Foto", "9 cranes"
  decorations?: string[]; // "Chevalier de l'Ordre de la Valeur"
  villageOrigine?: string; // "Foto"
  chefferie?: string; // "Groupement Foto"
  lieuResidence?: string; // Ville actuelle
}

// ============================================
// Famille — structure complete
// ============================================
export interface FamilleGroupe {
  categorie: FamilleCategorie;
  labelCustom?: string; // Si categorie = "autre"
  coteFamille?: "marie" | "mariee" | "defunt" | "commun"; // Pour mariages
  membres: FamilleMembre[];
}

export interface FamilleMembre {
  nom: string;
  conjoint?: string; // "epse Mboua" / "et epouse"
  villeResidence?: string; // "Paris, France"
  mention?: string; // "(Aine)", "et famille", "et enfants"
  estDecede?: boolean; // "Feu Tchinda Samuel"
}

export type FamilleCategorie =
  | "epoux"
  | "epouse"
  | "co-epouses"
  | "enfants"
  | "enfants-adoptifs"
  | "petits-enfants"
  | "arriere-petits-enfants"
  | "freres-soeurs"
  | "demi-freres-soeurs"
  | "parents"
  | "beaux-parents"
  | "belle-famille"
  | "beaux-freres-belles-soeurs"
  | "gendres-brus"
  | "grands-parents"
  | "oncles-tantes-paternels"
  | "oncles-tantes-maternels"
  | "cousins-cousines"
  | "neveux-nieces"
  | "parrain-marraine"
  | "notable"
  | "associations"
  | "communaute-religieuse"
  | "collegues"
  | "amis"
  | "temoins"
  | "garcons-honneur"
  | "demoiselles-honneur"
  | "autre";

export const FAMILLE_CATEGORIES: {
  value: FamilleCategorie;
  label: string;
  forTypes?: EventType[];
}[] = [
  { value: "epoux", label: "Epoux" },
  { value: "epouse", label: "Epouse(s)" },
  { value: "co-epouses", label: "Co-epouses", forTypes: ["funerailles", "levee-de-deuil"] },
  { value: "enfants", label: "Enfants" },
  { value: "enfants-adoptifs", label: "Enfants adoptifs" },
  { value: "petits-enfants", label: "Petits-enfants" },
  { value: "arriere-petits-enfants", label: "Arriere-petits-enfants" },
  { value: "freres-soeurs", label: "Freres et soeurs" },
  { value: "demi-freres-soeurs", label: "Demi-freres et demi-soeurs" },
  { value: "parents", label: "Pere et mere" },
  { value: "beaux-parents", label: "Beaux-parents" },
  { value: "belle-famille", label: "Belle-famille" },
  { value: "beaux-freres-belles-soeurs", label: "Beaux-freres et belles-soeurs" },
  { value: "gendres-brus", label: "Gendres et belles-filles" },
  { value: "grands-parents", label: "Grands-parents" },
  { value: "oncles-tantes-paternels", label: "Oncles et tantes (cote paternel)" },
  { value: "oncles-tantes-maternels", label: "Oncles et tantes (cote maternel)" },
  { value: "cousins-cousines", label: "Cousins et cousines" },
  { value: "neveux-nieces", label: "Neveux et nieces" },
  { value: "parrain-marraine", label: "Parrain et marraine" },
  { value: "temoins", label: "Temoins", forTypes: ["mariage-civil", "mariage-religieux"] },
  { value: "garcons-honneur", label: "Garcons d'honneur", forTypes: ["mariage-civil", "mariage-religieux"] },
  { value: "demoiselles-honneur", label: "Demoiselles d'honneur", forTypes: ["mariage-civil", "mariage-religieux"] },
  { value: "notable", label: "Notables et chefs traditionnels" },
  { value: "associations", label: "Associations et groupes" },
  { value: "communaute-religieuse", label: "Communaute religieuse" },
  { value: "collegues", label: "Collegues et anciens collegues" },
  { value: "amis", label: "Amis et proches" },
  { value: "autre", label: "Autre" },
];

// ============================================
// Programme
// ============================================
export interface ProgrammeJour {
  id: string;
  jour: string; // "Vendredi 15 avril 2026"
  evenements: ProgrammeEvenement[];
}

export interface ProgrammeEvenement {
  heure: string;
  titre: string;
  lieu: string;
  description?: string;
  adresse?: string;
  typeEvenement?: "religieux" | "traditionnel" | "civil" | "reception" | "cortege" | "veillee" | "autre";
  codeVestimentaire?: string; // "Tenue traditionnelle blanche"
  celebrant?: string;
}

// ============================================
// Dot (mariage traditionnel)
// ============================================
export interface DotItem {
  nom: string;
  quantite?: string;
  description?: string;
  categorie: "boisson" | "nourriture" | "animal" | "tissu" | "argent" | "objet" | "autre";
  estObligatoire: boolean;
}

export const DOT_CATEGORIES = [
  { value: "boisson", label: "Boissons" },
  { value: "nourriture", label: "Nourriture" },
  { value: "animal", label: "Animaux" },
  { value: "tissu", label: "Pagnes et tissus" },
  { value: "argent", label: "Enveloppes / Argent" },
  { value: "objet", label: "Objets" },
  { value: "autre", label: "Autre" },
] as const;

// Suggestions pour pre-remplir la dot bamileke
export const DOT_SUGGESTIONS_BAMILEKE: DotItem[] = [
  { nom: "Vin de raphia (matango)", quantite: "5 bidons de 20L", categorie: "boisson", estObligatoire: true },
  { nom: "Vin rouge", quantite: "2 casiers", categorie: "boisson", estObligatoire: true },
  { nom: "Bieres", quantite: "3 casiers", categorie: "boisson", estObligatoire: false },
  { nom: "Huile rouge (huile de palme)", quantite: "20 litres", categorie: "nourriture", estObligatoire: true },
  { nom: "Sel", quantite: "2 sacs", categorie: "nourriture", estObligatoire: true },
  { nom: "Chevres", quantite: "2", categorie: "animal", estObligatoire: true },
  { nom: "Poulets", quantite: "4", categorie: "animal", estObligatoire: false },
  { nom: "Pagnes pour la belle-mere", quantite: "3 pagnes", categorie: "tissu", estObligatoire: true },
  { nom: "Pagnes pour les tantes", quantite: "5 pagnes", categorie: "tissu", estObligatoire: true },
  { nom: "Noix de cola", quantite: "1 panier", categorie: "nourriture", estObligatoire: true },
  { nom: "Tabac traditionnel", categorie: "autre", estObligatoire: false },
  { nom: "Enveloppe pour le pere", categorie: "argent", estObligatoire: true },
  { nom: "Enveloppe pour la mere", categorie: "argent", estObligatoire: true },
  { nom: "Enveloppe pour les oncles maternels", categorie: "argent", estObligatoire: true },
  { nom: "Sacs de riz", quantite: "2 sacs de 50kg", categorie: "nourriture", estObligatoire: false },
  { nom: "Regimes de plantains", quantite: "5 regimes", categorie: "nourriture", estObligatoire: false },
  { nom: "Valise de la mariee", description: "Vetements, chaussures, bijoux", categorie: "objet", estObligatoire: true },
  { nom: "Chaise traditionnelle", description: "Pour le beau-pere", categorie: "objet", estObligatoire: false },
  { nom: "Parapluie", categorie: "objet", estObligatoire: false },
  { nom: "Ustensiles de cuisine", description: "Marmites, assiettes", categorie: "objet", estObligatoire: false },
];

// ============================================
// Temoins
// ============================================
export interface Temoin {
  nom: string;
  profession?: string;
  ville?: string;
  cote: "marie" | "mariee";
}

// ============================================
// Contributions financieres
// ============================================
export interface ContributionInfo {
  message?: string; // "Toute contribution est la bienvenue"
  orangeMoney?: string;
  mtnMomo?: string;
  rib?: string;
  paypal?: string;
  interac?: string; // Diaspora Canada
  westernUnion?: string;
  nomBeneficiaire?: string;
}

// ============================================
// Paiements en ligne (CinetPay)
// ============================================
export interface PaymentRecord {
  id: string;
  fairePartId: string;
  transactionId: string;
  amount: number;
  currency: string;
  donorName: string;
  donorPhone?: string;
  message?: string;
  isAnonymous: boolean;
  status: "pending" | "completed" | "failed";
  paymentMethod?: string;
  createdAt: string;
  completedAt?: string;
}

// ============================================
// Contacts famille (multiples)
// ============================================
export interface ContactFamille {
  nom: string;
  telephone: string;
  ville?: string;
  role?: string; // "President du comite", "Aine de la famille"
}

// ============================================
// Medias (photos + videos)
// ============================================
export type MediaTag = "ceremonie" | "famille" | "reception" | "decoration" | "veillee" | "cortege" | "portrait" | "recap" | "autre";

export const MEDIA_TAGS: { value: MediaTag; label: string }[] = [
  { value: "ceremonie", label: "Ceremonie" },
  { value: "famille", label: "Famille" },
  { value: "reception", label: "Reception" },
  { value: "decoration", label: "Decoration" },
  { value: "veillee", label: "Veillee" },
  { value: "cortege", label: "Cortege" },
  { value: "portrait", label: "Portrait" },
  { value: "recap", label: "Recap / Montage" },
  { value: "autre", label: "Autre" },
];

export type MediaType = "photo" | "video-upload" | "video-youtube";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string; // Firebase Storage URL for photos/uploads, YouTube URL for youtube
  youtubeId?: string; // extracted YouTube video ID
  thumbnail?: string;
  caption?: string;
  addedBy?: string; // nom de la personne qui a ajoute
  tags?: MediaTag[];
  programmeEventId?: string; // lie a un evenement du programme
  isDownloadable: boolean;
  isCover: boolean;
  isRecap: boolean; // video recap principale
  order: number;
}

// Backward compat alias
export type PhotoItem = MediaItem;
export type PhotoTag = MediaTag;
export const PHOTO_TAGS = MEDIA_TAGS;

// ============================================
// Design du faire-part
// ============================================
export interface FairePartDesign {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  borderStyle: "classic" | "bamileke" | "modern" | "floral" | "royal" | "none";
  template: "funerailles" | "mariage" | "celebration" | "bapteme";
}

// ============================================
// Bougies virtuelles
// ============================================
export interface VirtualCandle {
  id: string;
  fairePartId: string;
  auteur: string;
  createdAt: string;
}

// ============================================
// Condoleances / Messages
// ============================================
export interface Condolence {
  id: string;
  fairePartId: string;
  auteur: string;
  lien: string;
  message: string;
  ville?: string;
  createdAt: string;
}

// ============================================
// Constantes et options
// ============================================
export const LIEN_OPTIONS = [
  "Famille",
  "Ami(e)",
  "Collegue",
  "Voisin(e)",
  "Ancien(ne) eleve",
  "Membre de l'eglise",
  "Notable",
  "Connaissance",
  "Autre",
];

export const TITRES_HONORIFIQUES = [
  "Feu",
  "Feue",
  "Papa",
  "Maman",
  "Grand-papa",
  "Grand-maman",
  "Sa Majeste",
  "Fo",
  "Mafo",
  "Nde",
  "Tah",
  "Nkamgan",
  "Docteur",
  "Professeur",
  "Maitre",
  "Colonel",
  "General",
  "Reverend Pere",
  "Pasteur",
  "Soeur",
];

export const REGIONS_CAMEROUN = [
  "Adamaoua",
  "Centre",
  "Est",
  "Extreme-Nord",
  "Littoral",
  "Nord",
  "Nord-Ouest",
  "Ouest",
  "Sud",
  "Sud-Ouest",
];

export const VILLES_CAMEROUN = [
  "Yaounde",
  "Douala",
  "Bafoussam",
  "Dschang",
  "Bamenda",
  "Garoua",
  "Maroua",
  "Bertoua",
  "Ebolowa",
  "Ngaoundere",
  "Buea",
  "Limbe",
  "Kribi",
  "Nkongsamba",
  "Foumban",
  "Bafou",
  "Bandjoun",
  "Bangangte",
  "Mbouda",
  "Bana",
];

export const PAYS_DIASPORA = [
  "France",
  "Canada",
  "Belgique",
  "Allemagne",
  "Etats-Unis",
  "Royaume-Uni",
  "Suisse",
  "Italie",
  "Espagne",
  "Chine",
  "Gabon",
  "Guinee Equatoriale",
  "Congo",
  "Cote d'Ivoire",
  "Senegal",
  "Nigeria",
  "Afrique du Sud",
];

export const SYMBOLES_RELIGIEUX = [
  { value: "croix", label: "Croix chretienne" },
  { value: "croissant", label: "Croissant islamique" },
  { value: "aucun", label: "Aucun" },
] as const;

// ============================================
// Templates de design par defaut
// ============================================
export const DEFAULT_DESIGNS: Record<string, FairePartDesign> = {
  "funerailles-bamileke": {
    primaryColor: "#1F2E1F",
    accentColor: "#B8935A",
    backgroundColor: "#F5F1E8",
    borderStyle: "bamileke",
    template: "funerailles",
  },
  "funerailles-classique": {
    primaryColor: "#1A1A1A",
    accentColor: "#8B7355",
    backgroundColor: "#FFFFFF",
    borderStyle: "classic",
    template: "funerailles",
  },
  "funerailles-royal": {
    primaryColor: "#2D1B4E",
    accentColor: "#D4AF37",
    backgroundColor: "#FAF8F5",
    borderStyle: "royal",
    template: "funerailles",
  },
  "mariage-traditionnel": {
    primaryColor: "#2C1810",
    accentColor: "#C9A96E",
    backgroundColor: "#FFF8F0",
    borderStyle: "bamileke",
    template: "mariage",
  },
  "mariage-classique": {
    primaryColor: "#1A1A2E",
    accentColor: "#E2B04A",
    backgroundColor: "#FFFDF9",
    borderStyle: "floral",
    template: "mariage",
  },
  "mariage-modern": {
    primaryColor: "#2D3436",
    accentColor: "#E17055",
    backgroundColor: "#FFFFFF",
    borderStyle: "modern",
    template: "mariage",
  },
  "bapteme": {
    primaryColor: "#1B4965",
    accentColor: "#5FA8D3",
    backgroundColor: "#F0F8FF",
    borderStyle: "modern",
    template: "bapteme",
  },
  "levee-deuil": {
    primaryColor: "#2D1B1B",
    accentColor: "#B8935A",
    backgroundColor: "#F5F1E8",
    borderStyle: "bamileke",
    template: "funerailles",
  },
};
