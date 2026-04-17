export const services = [
  {
    id: "organisation-complete",
    title: "Organisation complete des obseques",
    shortDescription:
      "De l'annonce au recueillement, nous orchestrons chaque etape avec rigueur et sensibilite.",
    description:
      "Un chef de projet dedie vous accompagne du premier appel jusqu'a la fin de la ceremonie. Nous coordonnons l'ensemble des prestataires, gerons le planning et veillons a ce que chaque detail soit a la hauteur de l'hommage que vous souhaitez rendre.",
    includes: [
      "Chef de projet dedie",
      "Coordination de tous les prestataires",
      "Planning detaille de la ceremonie",
      "Gestion des imprevisibles",
      "Accompagnement le jour J",
    ],
    icon: "ClipboardList",
  },
  {
    id: "decoration-amenagement",
    title: "Decoration et amenagement",
    shortDescription:
      "Des lieux a la hauteur de l'hommage que vous souhaitez rendre.",
    description:
      "Nous concevons et realisons la decoration de la chapelle ardente, de la salle de veillee et du lieu de reception. Chaque mise en scene est pensee pour refleter la dignite du moment et les souhaits de la famille.",
    includes: [
      "Chapelle ardente personnalisee",
      "Decoration salle de veillee",
      "Amenagement du lieu de reception",
      "Arrangements floraux",
      "Eclairage d'ambiance",
    ],
    icon: "Flower2",
  },
  {
    id: "location-materiel",
    title: "Location de materiel",
    shortDescription:
      "Chaises, tables, baches, tentes, sonorisation, eclairage : tout est disponible.",
    description:
      "Nous disposons d'un parc de materiel complet pour accueillir de 50 a plus de 2000 invites. Tentes, chaises, tables, nappes, sonorisation, eclairage — tout est livre, installe et retire par nos equipes.",
    includes: [
      "Tentes et baches (toutes tailles)",
      "Chaises et tables avec nappes",
      "Systeme de sonorisation",
      "Eclairage et groupes electrogenes",
      "Installation et retrait complets",
    ],
    icon: "Tent",
  },
  {
    id: "coordination-traiteur",
    title: "Coordination traiteur",
    shortDescription:
      "Repas de veillee, reception post-enterrement : une restauration a la hauteur.",
    description:
      "Nous travaillons avec les meilleurs traiteurs de la region pour proposer des menus adaptes a chaque etape de la ceremonie. De la veillee a la reception, chaque repas est organise avec soin.",
    includes: [
      "Selection du traiteur adapte",
      "Menus personnalises",
      "Service pour la veillee",
      "Reception post-enterrement",
      "Gestion des boissons",
    ],
    icon: "UtensilsCrossed",
  },
  {
    id: "impression-programme",
    title: "Gestion du programme et impression",
    shortDescription:
      "Faire-parts, programmes de ceremonie, livrets : une communication soignee.",
    description:
      "Nous concevons et imprimons tous les supports de communication lies a la ceremonie : faire-parts d'annonce, programmes de ceremonie, livrets de recueillement, banderoles et affiches.",
    includes: [
      "Faire-parts d'annonce",
      "Programmes de ceremonie",
      "Livrets de recueillement",
      "Banderoles et affiches",
      "Livraison et distribution",
    ],
    icon: "FileText",
  },
  {
    id: "transport",
    title: "Transport",
    shortDescription:
      "Corbillard, location de bus pour invites, vehicules VIP.",
    description:
      "Nous organisons le transport de la depouille et des invites. Corbillard, minibus, vehicules VIP — chaque deplacement est planifie pour que la ceremonie se deroule sans contretemps.",
    includes: [
      "Corbillard",
      "Location de bus pour les invites",
      "Vehicules VIP",
      "Coordination des deplacements",
      "Itineraires planifies",
    ],
    icon: "Car",
  },
  {
    id: "accompagnement-administratif",
    title: "Accompagnement administratif",
    shortDescription:
      "Permis d'inhumer, demarches mairie : nous gerons les formalites.",
    description:
      "Les demarches administratives sont souvent meconnues et stressantes en periode de deuil. Nous prenons en charge l'ensemble des formalites : obtention du permis d'inhumer, declarations, correspondances avec les autorites.",
    includes: [
      "Permis d'inhumer",
      "Demarches a la mairie",
      "Declaration de deces",
      "Coordination avec les autorites",
      "Suivi des documents officiels",
    ],
    icon: "FileCheck",
  },
  {
    id: "levee-de-deuil",
    title: "Organisation de la levee de deuil",
    shortDescription:
      "Un evenement souvent plusieurs mois apres, organise avec le meme soin.",
    description:
      "La levee de deuil est un moment important dans la tradition camerounaise. Nous l'organisons avec la meme rigueur et le meme souci du detail que les obseques elles-memes, plusieurs mois apres le deces.",
    includes: [
      "Organisation complete de l'evenement",
      "Decoration et amenagement",
      "Coordination traiteur",
      "Sonorisation et animation",
      "Gestion des invitations",
    ],
    icon: "Heart",
  },
];

export const testimonials = [
  {
    quote:
      "Dans un moment ou nous etions completement perdus, ETS Mme Jesus a pris les choses en main avec une efficacite et une delicatesse remarquables. Tout etait parfait, du debut a la fin.",
    family: "Famille Tchinda",
    city: "Dschang",
  },
  {
    quote:
      "Nous vivons en Europe et il nous etait impossible d'organiser les obseques de notre pere depuis la France. L'equipe de Mme Jesus a tout gere comme si nous etions sur place. Un immense merci.",
    family: "Famille Ngueko",
    city: "Bafoussam",
  },
  {
    quote:
      "La decoration etait magnifique, les invites ont tous salue l'organisation impeccable. Mme Jesus et son equipe ont rendu un hommage digne a notre mere.",
    family: "Famille Mboua",
    city: "Dschang",
  },
];

export const galleryItems = [
  {
    id: 1,
    src: "/images/event-1.jpg",
    type: "photo" as const,
    category: "receptions",
    title: "Reception de 500 invites",
    location: "Dschang",
    date: "Mars 2026",
    guests: "500+",
    description:
      "Une reception d'envergure organisee sous chapiteaux, avec une decoration florale raffinee et un service traiteur d'excellence.",
  },
  {
    id: 2,
    src: "/images/realisation-deco.jpg",
    type: "photo" as const,
    category: "decorations",
    title: "Decoration chapelle ardente",
    location: "Dschang",
    date: "Fevrier 2026",
    guests: "300+",
    description:
      "Mise en scene sobre et elegante de la chapelle ardente, avec arrangements floraux blancs et eclairage d'ambiance.",
  },
  {
    id: 3,
    src: "/images/realisation-deco2.jpg",
    type: "photo" as const,
    category: "ceremonies",
    title: "Ceremonie religieuse",
    location: "Bafoussam",
    date: "Janvier 2026",
    guests: "800+",
    description:
      "Organisation complete d'une ceremonie religieuse pour plus de 800 personnes, avec sonorisation et coordination des intervenants.",
  },
  {
    id: 4,
    src: "/images/ceremony-1.jpg",
    type: "photo" as const,
    category: "veillees",
    title: "Veillee funebre",
    location: "Dschang",
    date: "Decembre 2025",
    guests: "200+",
    description:
      "Amenagement complet de la veillee avec eclairage, chaises, baches et restauration pour les proches.",
  },
  {
    id: 5,
    src: "/images/ceremony-3.jpg",
    type: "photo" as const,
    category: "receptions",
    title: "Reception levee de deuil",
    location: "Dschang",
    date: "Novembre 2025",
    guests: "1000+",
    description:
      "Grande reception pour la levee de deuil avec plus de 1000 invites, tentes, traiteur et sonorisation.",
  },
  {
    id: 6,
    src: "/images/event-5.jpg",
    type: "photo" as const,
    category: "decorations",
    title: "Decoration reception",
    location: "Bafoussam",
    date: "Octobre 2025",
    guests: "400+",
    description:
      "Decoration complete du lieu de reception avec drapes, fleurs et mise en lumiere soignee.",
  },
  {
    id: 7,
    src: "/videos/video-1.mp4",
    thumbnail: "/images/video-thumb-1.jpg",
    type: "video" as const,
    category: "receptions",
    title: "Apercu d'une reception",
    location: "Dschang",
    date: "Mars 2026",
    guests: "600+",
    description:
      "Vue d'ensemble d'une reception organisee par ETS Mme Jesus, avec plus de 600 invites.",
  },
  {
    id: 8,
    src: "/videos/video-2.mp4",
    thumbnail: "/images/video-thumb-2.jpg",
    type: "video" as const,
    category: "decorations",
    title: "Mise en place decoration",
    location: "Dschang",
    date: "Fevrier 2026",
    guests: "",
    description:
      "Processus de mise en place de la decoration pour une ceremonie funebre.",
  },
];

export const categories = [
  { id: "all", label: "Toutes" },
  { id: "ceremonies", label: "Ceremonies religieuses" },
  { id: "veillees", label: "Veillees" },
  { id: "receptions", label: "Receptions" },
  { id: "levees", label: "Levees de deuil" },
  { id: "decorations", label: "Decorations" },
];

export const processSteps = [
  {
    number: 1,
    title: "Premier contact",
    description:
      "Appelez-nous ou ecrivez-nous sur WhatsApp a toute heure. Nous sommes disponibles 24h/24 pour recevoir votre appel.",
  },
  {
    number: 2,
    title: "Visite et ecoute",
    description:
      "Nous venons a votre rencontre pour comprendre vos besoins, vos traditions et vos souhaits pour la ceremonie.",
  },
  {
    number: 3,
    title: "Proposition personnalisee",
    description:
      "Nous vous presentons un devis detaille et un planning adapte a votre budget et a vos attentes.",
  },
  {
    number: 4,
    title: "Organisation et coordination",
    description:
      "Notre equipe prend en charge l'ensemble de la logistique : decoration, traiteur, transport, impression, sonorisation.",
  },
  {
    number: 5,
    title: "Accompagnement post-ceremonie",
    description:
      "Nous restons a vos cotes apres la ceremonie pour le rangement, le bilan et la preparation de la levee de deuil si souhaitee.",
  },
];

export const stats = [
  { value: 10, suffix: "+", label: "Annees d'experience" },
  { value: 500, suffix: "+", label: "Ceremonies organisees" },
  { value: 400, suffix: "+", label: "Familles accompagnees" },
  { value: 5, suffix: "", label: "Villes desservies" },
];

export const values = [
  {
    title: "Dignite",
    description:
      "Chaque defunt merite un hommage a la hauteur de sa vie. Nous traitons chaque ceremonie avec le plus grand respect.",
    icon: "Crown",
  },
  {
    title: "Excellence",
    description:
      "Aucun detail n'est laisse au hasard. De la decoration a la coordination, tout est execute avec precision.",
    icon: "Award",
  },
  {
    title: "Disponibilite",
    description:
      "Nous sommes joignables 24h/24, 7j/7. Un deces n'attend pas les heures de bureau.",
    icon: "Clock",
  },
  {
    title: "Discretion",
    description:
      "Votre intimite familiale est sacree. Nous travaillons en coulisses pour que vous puissiez vivre votre deuil en paix.",
    icon: "Shield",
  },
];
