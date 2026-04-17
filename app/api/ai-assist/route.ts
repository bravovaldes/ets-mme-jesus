import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface AiRequest {
  type: "generate-full" | "rewrite-section";
  section?: string;
  answers: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    const body: AiRequest = await request.json();

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    let prompt: string;

    if (body.type === "generate-full") {
      prompt = buildFullGenerationPrompt(body.answers);
    } else {
      prompt = buildSectionRewritePrompt(body.section || "", body.answers);
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Try to parse JSON from the response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ result: parsed });
      }
    } catch {
      // If not JSON, return raw text
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI assist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function buildFullGenerationPrompt(answers: Record<string, string>): string {
  const sexe = answers.sexe || "homme";
  const il = sexe === "femme" ? "elle" : "il";
  const le = sexe === "femme" ? "la" : "le";
  const feu = sexe === "femme" ? "Feue" : "Feu";
  const ne = sexe === "femme" ? "Nee" : "Ne";
  const son = sexe === "femme" ? "sa" : "son";

  return `Tu es un redacteur specialise dans les faire-parts au Cameroun, particulierement en culture Bamileke (region Ouest).

A partir des informations fournies par l'utilisateur, genere un faire-part COMPLET au format JSON.

INFORMATIONS DE L'UTILISATEUR :
- Type d'evenement : ${answers.eventType || "funerailles"}
- Sexe : ${sexe}
- Nom complet : ${answers.prenoms || ""} ${answers.nom || ""}
- Date de naissance : ${answers.dateNaissance || "non precisee"}
- Date de deces : ${answers.dateDeces || "non precisee"}
- Lieu de naissance : ${answers.lieuNaissance || "non precise"}
- Lieu de deces : ${answers.lieuDeces || "non precise"}
- Profession : ${answers.profession || "non precisee"}
- Titre traditionnel : ${answers.titreTradi || "aucun"}
- Village d'origine : ${answers.village || "non precise"}
- Nom du conjoint : ${answers.conjoint || "non precise"}
- Nombre d'enfants : ${answers.nbEnfants || "non precise"}
- Ville de la ceremonie : ${answers.ville || "non precisee"}
- Eglise/lieu de culte : ${answers.eglise || "non precise"}
- Ce que l'utilisateur veut dire : ${answers.description || "rien de particulier"}

REGLES :
- Utilise "${feu}" (pas "Feu" si c'est une femme)
- Utilise les bons pronoms : ${il}, ${le}, ${son}
- "${ne} a..." pour commencer la biographie
- Ton DIGNE, SOBRE, RESPECTUEUX. Jamais d'emojis.
- Les textes doivent etre en francais camerounais naturel.
- La formule d'annonce doit etre une longue phrase traditionnelle.
- La biographie doit faire 3-4 paragraphes.
- L'epitaphe doit etre 1-2 phrases touchantes.
- Le programme doit etre realiste pour la region Ouest Cameroun.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte :
{
  "titre": "Faire-part de deces et de funerailles",
  "sousTitre": "[formule d'annonce complete]",
  "versetBiblique": "[verset adapte]",
  "epitaphe": "[phrase d'hommage]",
  "biographie": "[3-4 paragraphes]",
  "remerciements": "[message de remerciement]",
  "personneUpdates": {
    "titreHonorifique": "${feu} ${sexe === "femme" ? "Maman" : "Papa"}",
    "ageAuDeces": null
  },
  "programme": [
    {
      "jour": "[Jour et date]",
      "evenements": [
        {"heure": "18h00", "titre": "[titre]", "lieu": "[lieu]", "description": "[description optionnelle]"}
      ]
    }
  ],
  "codeVestimentaire": "[suggestion]"
}

Genere le JSON maintenant, sans commentaires ni explications avant ou apres.`;
}

function buildSectionRewritePrompt(section: string, answers: Record<string, string>): string {
  const sexe = answers.sexe || "homme";
  const il = sexe === "femme" ? "elle" : "il";
  const feu = sexe === "femme" ? "Feue" : "Feu";

  const sectionPrompts: Record<string, string> = {
    sousTitre: `Reecris cette formule d'annonce pour un faire-part de deces camerounais. Sexe: ${sexe} (${feu}). Nom: ${answers.nom}. Village: ${answers.village}. L'utilisateur dit: "${answers.userText}". Retourne UNIQUEMENT le texte de l'annonce, rien d'autre.`,
    biographie: `Reecris cette biographie pour un faire-part. Sexe: ${sexe} (${il}). Nom: ${answers.prenoms} ${answers.nom}. Profession: ${answers.profession}. Village: ${answers.village}. Conjoint: ${answers.conjoint}. L'utilisateur dit: "${answers.userText}". Retourne UNIQUEMENT le texte de la biographie (3-4 paragraphes), rien d'autre.`,
    epitaphe: `Propose une epitaphe pour ${feu} ${answers.prenoms} ${answers.nom}. Sexe: ${sexe}. L'utilisateur dit: "${answers.userText}". Retourne UNIQUEMENT 1-2 phrases d'hommage, rien d'autre.`,
    messageInvitation: `Redige un message d'invitation pour un mariage traditionnel camerounais. L'utilisateur dit: "${answers.userText}". Retourne UNIQUEMENT le message, rien d'autre.`,
  };

  return sectionPrompts[section] || `Ameliore ce texte pour un faire-part camerounais: "${answers.userText}"`;
}
