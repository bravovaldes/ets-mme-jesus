import type { ContactFormData } from "./validators";

export function generateEmailHtml(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #F5F1E8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #E5E0D3; }
    .header { background: #1F2E1F; color: #F5F1E8; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: normal; }
    .header p { margin: 8px 0 0; opacity: 0.7; font-size: 14px; }
    .body { padding: 30px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8B8680; margin-bottom: 4px; }
    .value { font-size: 16px; color: #2C2C2C; }
    .divider { height: 1px; background: #E5E0D3; margin: 24px 0; }
    .services { display: flex; flex-wrap: wrap; gap: 8px; }
    .service-tag { background: #F5F1E8; color: #2C2C2C; padding: 4px 12px; font-size: 13px; border: 1px solid #E5E0D3; }
    .footer { background: #F5F1E8; padding: 20px 30px; text-align: center; font-size: 12px; color: #8B8680; }
    .accent { color: #B8935A; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouvelle demande de devis</h1>
      <p>Recue via le site web ETS Mme Jesus</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Nom</div>
        <div class="value">${data.nom}</div>
      </div>
      <div class="field">
        <div class="label">Telephone</div>
        <div class="value"><a href="tel:${data.telephone}" class="accent">${data.telephone}</a></div>
      </div>
      ${data.email ? `<div class="field"><div class="label">Email</div><div class="value">${data.email}</div></div>` : ""}
      <div class="divider"></div>
      <div class="field">
        <div class="label">Type de ceremonie</div>
        <div class="value">${data.typeCeremonie}</div>
      </div>
      <div class="field">
        <div class="label">Date prevue</div>
        <div class="value">${data.datePrevue}</div>
      </div>
      <div class="field">
        <div class="label">Lieu</div>
        <div class="value">${data.lieu}</div>
      </div>
      <div class="field">
        <div class="label">Nombre d'invites</div>
        <div class="value">${data.nombreInvites}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <div class="label">Services demandes</div>
        <div class="services">${data.services.map((s) => `<span class="service-tag">${s}</span>`).join("")}</div>
      </div>
      ${data.budget ? `<div class="field"><div class="label">Budget</div><div class="value">${data.budget}</div></div>` : ""}
      ${data.message ? `<div class="divider"></div><div class="field"><div class="label">Message</div><div class="value">${data.message}</div></div>` : ""}
    </div>
    <div class="footer">
      ETS Mme Jesus &mdash; Evenementiel funeraire &mdash; Dschang, Cameroun
    </div>
  </div>
</body>
</html>`;
}
