import type { FairePartPage } from "./types";
import { DEFAULT_DESIGNS } from "./types";

// ============================================
// Templates pre-remplis — l'utilisateur remplace juste les noms
// ============================================

export interface Template {
  id: string;
  label: string;
  description: string;
  eventType: FairePartPage["eventType"];
  thumbnail: string; // Couleur du design pour miniature
  data: Partial<FairePartPage>;
}

export const TEMPLATES: Template[] = [
  // ==========================================
  // FUNERAILLES
  // ==========================================
  {
    id: "funerailles-bamileke",
    label: "Funerailles Bamileke",
    description: "Faire-part complet avec programme sur 2 jours, notables, associations. Style Bamileke traditionnel.",
    eventType: "funerailles",
    thumbnail: "#1F2E1F",
    data: {
      eventType: "funerailles",
      titre: "Faire-part de deces et de funerailles",
      versetBiblique: "Je suis la resurrection et la vie. Celui qui croit en moi vivra, meme s'il meurt. - Jean 11:25",
      symboleReligieux: "croix",
      sousTitre: "La grande famille [NOM], les enfants, petits-enfants, freres, soeurs, la belle-famille et les notables du groupement [VILLAGE] ont la profonde douleur de vous annoncer le deces de leur pere, grand-pere, frere, oncle et notable",
      epitaphe: "Un homme/une femme de coeur, un pilier de sa famille, un exemple pour sa communaute. Que la terre de nos ancetres lui soit legere.",
      personnes: [{
        nom: "[NOM]",
        prenoms: "[PRENOMS]",
        titreHonorifique: "Feu Papa",
        dateNaissance: "[DATE DE NAISSANCE]",
        dateDeces: "[DATE DE DECES]",
        lieuNaissance: "[VILLAGE], Dschang",
        lieuDeces: "[HOPITAL / LIEU]",
        photoPortrait: "/images/fondatrice.jpg",
        profession: "[PROFESSION]",
        titreTradi: "Notable du groupement [VILLAGE]",
        villageOrigine: "[VILLAGE]",
        chefferie: "Groupement [VILLAGE]",
      }],
      famille: [
        { categorie: "epouse", membres: [{ nom: "Mme [NOM] nee [NOM JEUNE FILLE]" }] },
        { categorie: "enfants", membres: [
          { nom: "[PRENOM] [NOM]", mention: "(Aine)", villeResidence: "[VILLE]" },
          { nom: "[PRENOM] [NOM]", conjoint: "epse [NOM CONJOINT]", villeResidence: "[VILLE, PAYS]" },
          { nom: "[PRENOM] [NOM]", mention: "et famille", villeResidence: "[VILLE, PAYS]" },
        ]},
        { categorie: "petits-enfants", membres: [{ nom: "[NOMBRE] petits-enfants" }] },
        { categorie: "freres-soeurs", membres: [
          { nom: "[PRENOM] [NOM]", villeResidence: "[VILLE]" },
        ]},
        { categorie: "belle-famille", membres: [{ nom: "Famille [NOM]" }] },
        { categorie: "notable", membres: [
          { nom: "Sa Majeste le Chef superieur de [VILLAGE]" },
          { nom: "Les notables du groupement [VILLAGE]" },
        ]},
      ],
      programme: [
        {
          id: "j1", jour: "[JOUR] [DATE]",
          evenements: [
            { heure: "18h00", titre: "Arrivee de la depouille au domicile", lieu: "Domicile familial, [QUARTIER]" },
            { heure: "20h00", titre: "Veillee funebre", lieu: "Domicile familial", description: "Chants, prieres, temoignages. Repas offert.", codeVestimentaire: "Tenue sombre ou pagne de deuil" },
          ],
        },
        {
          id: "j2", jour: "[JOUR] [DATE]",
          evenements: [
            { heure: "06h00", titre: "Toilette mortuaire et mise en biere", lieu: "Domicile familial" },
            { heure: "08h00", titre: "Levee de corps", lieu: "Domicile familial" },
            { heure: "09h00", titre: "Messe de requiem", lieu: "[EGLISE]", celebrant: "[NOM DU CELEBRANT]" },
            { heure: "11h30", titre: "Cortege funebre", lieu: "De l'eglise vers [CIMETIERE]" },
            { heure: "12h00", titre: "Inhumation", lieu: "Concession familiale, [VILLAGE]" },
            { heure: "13h30", titre: "Grand repas de reception", lieu: "Esplanade du domicile familial" },
          ],
        },
      ],
      biographie: "[PRENOM] [NOM], ne(e) a [VILLAGE] le [DATE], a consacre sa vie a [ACTIVITE/PROFESSION]. Epoux/Epouse de [NOM CONJOINT] depuis [ANNEE], pere/mere de [NOMBRE] enfants et grand-pere/grand-mere de [NOMBRE] petits-enfants, il/elle etait un pilier de sa famille et de sa communaute.\n\nSon integrite, sa generosite et son devouement etaient connus de tous. Il/Elle s'est eteint(e) paisiblement le [DATE] a [LIEU], entoure(e) de l'amour des siens.",
      remerciements: "La famille [NOM] remercie sincerement le personnel medical, la communaute chretienne, les notables et toutes les personnes qui ont apporte leur soutien.",
      contactsFamille: [
        { nom: "[NOM AINE]", telephone: "+237 6XX XX XX XX", ville: "[VILLE]", role: "President du comite" },
        { nom: "[NOM DIASPORA]", telephone: "+[INDICATIF] XXX XXX XXXX", ville: "[VILLE, PAYS]", role: "Coordination diaspora" },
      ],
      contactOrganisateur: "+1 418 490 1849",
      codeVestimentaire: "Pagne de deuil ou tenue sombre",
      contributions: {
        message: "Toute contribution pour accompagner dignement [NOM] est la bienvenue.",
        orangeMoney: "6XX XX XX XX ([NOM])",
        mtnMomo: "6XX XX XX XX ([NOM])",
      },
      ville: "Dschang",
      region: "Ouest",
      isPrivate: false,
      allowCondolences: true,
      allowPhotoDownload: true,
      fairePartDesign: DEFAULT_DESIGNS["funerailles-bamileke"],
    },
  },

  // ==========================================
  // MARIAGE TRADITIONNEL
  // ==========================================
  {
    id: "mariage-traditionnel-bamileke",
    label: "Mariage traditionnel (Dot) Bamileke",
    description: "Invitation complete avec liste de la dot, programme, deux familles. Style Bamileke.",
    eventType: "mariage-traditionnel",
    thumbnail: "#2C1810",
    data: {
      eventType: "mariage-traditionnel",
      titre: "Invitation au mariage traditionnel",
      versetBiblique: "Ce que Dieu a uni, que l'homme ne le separe pas. - Marc 10:9",
      symboleReligieux: "croix",
      sousTitre: "Les familles [NOM MARIE] et [NOM MARIEE] ont le plaisir et l'immense joie de vous inviter au mariage traditionnel (dot) de leurs enfants",
      messageInvitation: "C'est avec une immense joie que nous vous invitons a partager ce moment de bonheur. Votre presence sera pour nous le plus beau des cadeaux.",
      personnes: [
        { nom: "[NOM MARIE]", prenoms: "[PRENOMS]", photoPortrait: "/images/fondatrice.jpg", profession: "[PROFESSION]", villageOrigine: "[VILLAGE]", lieuResidence: "[VILLE]" },
        { nom: "[NOM MARIEE]", prenoms: "[PRENOMS]", photoPortrait: "/images/fondatrice.jpg", profession: "[PROFESSION]", villageOrigine: "[VILLAGE]", lieuResidence: "[VILLE]" },
      ],
      famille: [
        { categorie: "parents", coteFamille: "marie", membres: [
          { nom: "M. [NOM]", mention: "Pere du marie", villeResidence: "[VILLE]" },
          { nom: "Mme [NOM] nee [NOM]", mention: "Mere du marie", villeResidence: "[VILLE]" },
        ]},
        { categorie: "parents", coteFamille: "mariee", membres: [
          { nom: "M. [NOM]", mention: "Pere de la mariee", villeResidence: "[VILLE]" },
          { nom: "Mme [NOM] nee [NOM]", mention: "Mere de la mariee", villeResidence: "[VILLE]" },
        ]},
        { categorie: "freres-soeurs", coteFamille: "marie", membres: [
          { nom: "[PRENOM] [NOM]", villeResidence: "[VILLE]" },
        ]},
        { categorie: "freres-soeurs", coteFamille: "mariee", membres: [
          { nom: "[PRENOM] [NOM]", villeResidence: "[VILLE]" },
        ]},
      ],
      dotItems: [
        { nom: "Vin de raphia", quantite: "5 bidons de 20L", categorie: "boisson", estObligatoire: true },
        { nom: "Vin rouge", quantite: "2 casiers", categorie: "boisson", estObligatoire: true },
        { nom: "Huile rouge", quantite: "20 litres", categorie: "nourriture", estObligatoire: true },
        { nom: "Sel", quantite: "2 sacs", categorie: "nourriture", estObligatoire: true },
        { nom: "Chevres", quantite: "2", categorie: "animal", estObligatoire: true },
        { nom: "Pagnes pour la belle-mere", quantite: "3 pagnes wax", categorie: "tissu", estObligatoire: true },
        { nom: "Pagnes pour les tantes", quantite: "5 pagnes", categorie: "tissu", estObligatoire: true },
        { nom: "Noix de cola", quantite: "1 panier", categorie: "nourriture", estObligatoire: true },
        { nom: "Enveloppe pour le pere", categorie: "argent", estObligatoire: true },
        { nom: "Enveloppe pour la mere", categorie: "argent", estObligatoire: true },
        { nom: "Enveloppe pour les oncles maternels", categorie: "argent", estObligatoire: true },
        { nom: "Valise de la mariee", description: "Vetements, chaussures, bijoux", categorie: "objet", estObligatoire: true },
      ],
      programme: [{
        id: "j1", jour: "[SAMEDI] [DATE]",
        evenements: [
          { heure: "07h00", titre: "Accueil des invites et petit-dejeuner", lieu: "Residence [NOM MARIEE], [VILLE]" },
          { heure: "09h30", titre: "Arrivee de la delegation du marie", lieu: "Residence [NOM MARIEE]" },
          { heure: "10h30", titre: "Palabres et negociations de la dot", lieu: "Cour de la residence" },
          { heure: "12h00", titre: "Presentation de la mariee", lieu: "Cour de la residence", codeVestimentaire: "Tenue traditionnelle" },
          { heure: "12h30", titre: "Benediction des anciens", lieu: "Cour de la residence" },
          { heure: "13h30", titre: "Grand repas de reception", lieu: "Esplanade familiale" },
          { heure: "15h30", titre: "Animation musicale et danses", lieu: "Esplanade familiale" },
          { heure: "17h00", titre: "Depart de la mariee", lieu: "Cortege vers la residence [NOM MARIE]" },
        ],
      }],
      contactsFamille: [
        { nom: "[NOM Pere du marie]", telephone: "+237 6XX XX XX XX", ville: "[VILLE]" },
        { nom: "[NOM Pere de la mariee]", telephone: "+237 6XX XX XX XX", ville: "[VILLE]" },
      ],
      contactOrganisateur: "+1 418 490 1849",
      codeVestimentaire: "Pagne du mariage (tissu wax [COULEUR])",
      pagneInfo: "Pagne disponible chez [NOM] au +237 6XX XX XX XX ([PRIX] FCFA le metre)",
      contributions: {
        message: "Votre presence est notre plus beau cadeau.",
        orangeMoney: "6XX XX XX XX ([NOM])",
      },
      ville: "[VILLE]",
      region: "Ouest",
      isPrivate: false,
      allowCondolences: true,
      allowPhotoDownload: true,
      fairePartDesign: DEFAULT_DESIGNS["mariage-traditionnel"],
    },
  },

  // ==========================================
  // FUNERAILLES CLASSIQUE (non-Bamileke)
  // ==========================================
  {
    id: "funerailles-classique",
    label: "Funerailles classique",
    description: "Faire-part sobre et elegant. Convient a toutes les regions du Cameroun.",
    eventType: "funerailles",
    thumbnail: "#1A1A1A",
    data: {
      eventType: "funerailles",
      titre: "Avis de deces et de funerailles",
      symboleReligieux: "croix",
      sousTitre: "La famille [NOM] a la douleur de vous annoncer le deces de",
      personnes: [{ nom: "[NOM]", prenoms: "[PRENOMS]", photoPortrait: "/images/fondatrice.jpg", dateNaissance: "[DATE]", dateDeces: "[DATE]" }],
      famille: [
        { categorie: "epouse", membres: [{ nom: "[NOM CONJOINT(E)]" }] },
        { categorie: "enfants", membres: [{ nom: "[PRENOM NOM]", villeResidence: "[VILLE]" }] },
      ],
      programme: [{
        id: "j1", jour: "[DATE]",
        evenements: [
          { heure: "09h00", titre: "Ceremonie religieuse", lieu: "[LIEU]" },
          { heure: "11h00", titre: "Inhumation", lieu: "[CIMETIERE]" },
          { heure: "12h30", titre: "Reception", lieu: "[LIEU]" },
        ],
      }],
      contactsFamille: [{ nom: "[NOM]", telephone: "+237 6XX XX XX XX" }],
      contactOrganisateur: "+1 418 490 1849",
      ville: "[VILLE]",
      region: "Ouest",
      isPrivate: false,
      allowCondolences: true,
      allowPhotoDownload: true,
      fairePartDesign: DEFAULT_DESIGNS["funerailles-classique"],
    },
  },

  // ==========================================
  // LEVEE DE DEUIL
  // ==========================================
  {
    id: "levee-deuil-bamileke",
    label: "Levee de deuil",
    description: "Invitation a la ceremonie de fin de deuil. Style Bamileke.",
    eventType: "levee-de-deuil",
    thumbnail: "#2D1B1B",
    data: {
      eventType: "levee-de-deuil",
      titre: "Invitation a la levee de deuil",
      sousTitre: "La famille [NOM] a le plaisir de vous inviter a la levee de deuil de",
      personnes: [{ nom: "[NOM]", prenoms: "[PRENOMS]", titreHonorifique: "Feu", photoPortrait: "/images/fondatrice.jpg", dateDeces: "[DATE DU DECES]" }],
      famille: [
        { categorie: "epouse", membres: [{ nom: "[NOM VEUVE/VEUF]" }] },
        { categorie: "enfants", membres: [{ nom: "[PRENOM NOM]", villeResidence: "[VILLE]" }] },
      ],
      programme: [{
        id: "j1", jour: "[DATE]",
        evenements: [
          { heure: "08h00", titre: "Ceremonies traditionnelles", lieu: "Domicile familial" },
          { heure: "10h00", titre: "Sortie de deuil de la veuve/du veuf", lieu: "Domicile familial" },
          { heure: "11h00", titre: "Messe d'action de grace", lieu: "[EGLISE]" },
          { heure: "13h00", titre: "Grand repas", lieu: "Domicile familial" },
          { heure: "15h00", titre: "Animation et danses traditionnelles", lieu: "Domicile familial" },
        ],
      }],
      contactsFamille: [{ nom: "[NOM]", telephone: "+237 6XX XX XX XX" }],
      contactOrganisateur: "+1 418 490 1849",
      ville: "[VILLE]",
      region: "Ouest",
      isPrivate: false,
      allowCondolences: true,
      allowPhotoDownload: true,
      fairePartDesign: DEFAULT_DESIGNS["levee-deuil"],
    },
  },

  // ==========================================
  // MARIAGE CIVIL/RELIGIEUX
  // ==========================================
  {
    id: "mariage-civil-religieux",
    label: "Mariage civil et religieux",
    description: "Invitation elegante pour mariage civil et/ou religieux.",
    eventType: "mariage-religieux",
    thumbnail: "#1A1A2E",
    data: {
      eventType: "mariage-religieux",
      titre: "Invitation au mariage",
      versetBiblique: "L'amour est patient, l'amour est bon. - 1 Corinthiens 13:4",
      sousTitre: "M. et Mme [NOM PARENTS MARIE] et M. et Mme [NOM PARENTS MARIEE] ont la joie de vous faire part du mariage de leurs enfants",
      messageInvitation: "Nous serions honores de votre presence pour celebrer notre union.",
      personnes: [
        { nom: "[NOM]", prenoms: "[PRENOMS]", photoPortrait: "/images/fondatrice.jpg", profession: "[PROFESSION]" },
        { nom: "[NOM]", prenoms: "[PRENOMS]", photoPortrait: "/images/fondatrice.jpg", profession: "[PROFESSION]" },
      ],
      famille: [
        { categorie: "parents", coteFamille: "marie", membres: [{ nom: "M. et Mme [NOM]" }] },
        { categorie: "parents", coteFamille: "mariee", membres: [{ nom: "M. et Mme [NOM]" }] },
        { categorie: "temoins", coteFamille: "marie", membres: [{ nom: "[NOM TEMOIN]", villeResidence: "[VILLE]" }] },
        { categorie: "temoins", coteFamille: "mariee", membres: [{ nom: "[NOM TEMOIN]", villeResidence: "[VILLE]" }] },
      ],
      programme: [{
        id: "j1", jour: "[SAMEDI DATE]",
        evenements: [
          { heure: "10h00", titre: "Mariage civil", lieu: "Mairie de [VILLE]" },
          { heure: "14h00", titre: "Celebration religieuse", lieu: "[EGLISE]", celebrant: "[NOM CELEBRANT]" },
          { heure: "16h00", titre: "Vin d'honneur", lieu: "[LIEU]" },
          { heure: "19h00", titre: "Reception et soiree", lieu: "[SALLE]" },
        ],
      }],
      contactsFamille: [{ nom: "[NOM]", telephone: "+237 6XX XX XX XX" }],
      contactOrganisateur: "+1 418 490 1849",
      ville: "[VILLE]",
      region: "Ouest",
      isPrivate: false,
      allowCondolences: true,
      allowPhotoDownload: true,
      fairePartDesign: DEFAULT_DESIGNS["mariage-classique"],
    },
  },
];
