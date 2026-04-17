// CinetPay REST API integration
// Docs: https://docs.cinetpay.com/api/

export interface CinetPayInitParams {
  transaction_id: string;
  amount: number;
  currency: "XAF" | "XOF" | "CDF" | "GNF" | "USD";
  description: string;
  customer_name?: string;
  customer_phone_number?: string;
  customer_email?: string;
  return_url?: string;
  notify_url?: string;
  channels?: string; // "ALL", "MOBILE_MONEY", "CREDIT_CARD"
  metadata?: string;
}

export interface CinetPayInitResponse {
  code: string;
  message: string;
  description: string;
  data: {
    payment_token: string;
    payment_url: string;
  };
  api_response_id: string;
}

export interface CinetPayCheckResponse {
  code: string;
  message: string;
  data: {
    amount: string;
    currency: string;
    status: "ACCEPTED" | "REFUSED" | "ERROR";
    payment_method: string;
    description: string;
    metadata: string;
    operator_id: string;
    payment_date: string;
  };
  api_response_id: string;
}

const CINETPAY_BASE_URL = "https://api-checkout.cinetpay.com/v2";

export async function initializePayment(
  params: CinetPayInitParams
): Promise<CinetPayInitResponse> {
  const apiKey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;

  if (!apiKey || !siteId) {
    throw new Error("CinetPay credentials not configured");
  }

  const response = await fetch(`${CINETPAY_BASE_URL}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: apiKey,
      site_id: siteId,
      ...params,
    }),
  });

  if (!response.ok) {
    throw new Error(`CinetPay API error: ${response.status}`);
  }

  return response.json();
}

export async function verifyPayment(
  transactionId: string
): Promise<CinetPayCheckResponse> {
  const apiKey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;

  if (!apiKey || !siteId) {
    throw new Error("CinetPay credentials not configured");
  }

  const response = await fetch(`${CINETPAY_BASE_URL}/payment/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: apiKey,
      site_id: siteId,
      transaction_id: transactionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`CinetPay verification error: ${response.status}`);
  }

  return response.json();
}

export function generateTransactionId(fairePartId: string): string {
  return `fp-${fairePartId.slice(0, 8)}-${Date.now()}`;
}
