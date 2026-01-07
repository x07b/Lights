import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@example.com";

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  panierCode: string,
  items: Array<{ name: string; quantity: number }>,
) {
  try {
    const itemsList = items
      .map((item) => `<li>${item.name} (Quantité: ${item.quantity})</li>`)
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .code-box { background-color: #e8f0ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .code { font-size: 24px; font-weight: bold; color: #004aad; }
            .items-list { padding: 10px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Merci pour votre demande de devis!</h1>
              <p>Bonjour ${customerName},</p>
            </div>
            
            <p>Votre demande de devis a été reçue avec succès. Nous vous remercions de votre intérêt.</p>
            
            <div class="code-box">
              <p style="margin: 0 0 10px 0; color: #666;">Votre code de panier:</p>
              <div class="code">${panierCode}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Conservez ce code pour suivre votre demande</p>
            </div>
            
            <h3>Produits demandés:</h3>
            <ul class="items-list">
              ${itemsList}
            </ul>
            
            <p>Notre équipe examinera votre demande et vous contactera dans les meilleurs délais pour discuter des détails et des options de personnalisation.</p>
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            
            <div class="footer">
              <p>© 2025 Luxence. Tous droits réservés.</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas répondre directement.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Votre demande de devis - Code: ${panierCode}`,
      html: emailHtml,
    });

    console.log("Customer email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending customer email:", error);
    throw error;
  }
}

export async function sendAdminOrderNotificationEmail(
  customerName: string,
  customerEmail: string,
  panierCode: string,
  items: Array<{ name: string; quantity: number }>,
) {
  try {
    const itemsList = items
      .map((item) => `<li>${item.name} (Quantité: ${item.quantity})</li>`)
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #fff3cd; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .code-box { background-color: #e8f0ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .code { font-size: 20px; font-weight: bold; color: #004aad; }
            .customer-info { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .action-button { background-color: #004aad; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Nouvelle demande de devis reçue</h1>
            </div>
            
            <p>Une nouvelle demande de devis a été soumise sur votre plateforme.</p>
            
            <div class="customer-info">
              <h3>Informations du client:</h3>
              <p><strong>Nom:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
            </div>
            
            <div class="code-box">
              <p style="margin: 0 0 10px 0; color: #666;">Code de panier:</p>
              <div class="code">${panierCode}</div>
            </div>
            
            <h3>Produits demandés:</h3>
            <ul>
              ${itemsList}
            </ul>
            
            <a href="${process.env.ADMIN_DASHBOARD_URL || "https://your-domain.com/admin"}" class="action-button">
              Consulter le dashboard
            </a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Cet email a été généré automatiquement. Veuillez vous connecter au dashboard pour voir les détails complets et gérer cette commande.
            </p>
          </div>
        </body>
      </html>
    `;

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[NOUVELLE COMMANDE] ${panierCode} - ${customerName}`,
      html: emailHtml,
    });

    console.log("Admin notification email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    throw error;
  }
}
