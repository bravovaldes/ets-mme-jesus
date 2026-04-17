// WhatsApp Cloud API (Meta) integration
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api

const GRAPH_API_URL = "https://graph.facebook.com/v21.0";

export interface WhatsAppTemplateParams {
  [key: string]: string;
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  params: WhatsAppTemplateParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.log(
      `[WhatsApp] Not configured. Would send template "${templateName}" to ${to}`,
      params
    );
    return { success: false, error: "WhatsApp not configured" };
  }

  // Format phone number: ensure it starts with country code, no +
  const formattedPhone = to.replace(/[^0-9]/g, "").replace(/^0/, "237");

  const body = {
    messaging_product: "whatsapp",
    to: formattedPhone,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        {
          type: "body",
          parameters: Object.values(params).map((value) => ({
            type: "text",
            text: value,
          })),
        },
      ],
    },
  };

  try {
    const response = await fetch(
      `${GRAPH_API_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[WhatsApp] API error:", data);
      return {
        success: false,
        error: data.error?.message || "WhatsApp API error",
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error("[WhatsApp] Send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Template names (must be pre-approved in Meta Business)
export const TEMPLATES = {
  FAIRE_PART_SHARE: "faire_part_share",
  NEW_CONDOLENCE: "new_condolence",
  PROGRAMME_REMINDER: "programme_reminder",
} as const;
