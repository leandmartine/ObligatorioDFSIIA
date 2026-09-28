import { Resend } from "resend";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const profileUrl = process.env.PROFILE_URL || "http://localhost:5173/perfil";
const logoContent = readFileSync(
  fileURLToPath(new URL("../assets/ort-logo.png", import.meta.url)),
);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const layout = (content) => `
  <div style="background:#f5f5f5;padding:32px 16px;font-family:Arial,sans-serif;color:#242424;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e6e6e6;">
      <div style="padding:28px 32px;background:#800020;text-align:center;">
        <img src="cid:ort-logo" alt="Universidad ORT Uruguay" style="display:block;width:240px;max-width:100%;height:auto;margin:0 auto;">
      </div>
      <div style="padding:32px;">${content}</div>
      <div style="padding:20px 32px;border-top:1px solid #eeeeee;color:#777777;font-size:12px;">
        Marketplace interno de Universidad ORT Uruguay
      </div>
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    console.warn("Email no enviado: falta configurar RESEND_API_KEY");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      attachments: [{
        filename: "ort-logo.png",
        content: logoContent,
        content_id: "ort-logo",
      }],
    });
    if (error) {
      console.error("Error al enviar email con Resend:", error);
    }
  } catch (error) {
    console.error("Error inesperado al enviar email con Resend:", error);
  }
};

export const sendWelcomeEmail = async ({ name, email }) => {
  const safeName = escapeHtml(name);
  await sendEmail({
    to: email,
    subject: "Bienvenido al Marketplace ORT",
    html: layout(`
      <h1 style="margin-top:0;color:#800020;">¡Bienvenido, ${safeName}!</h1>
      <p>Tu cuenta en el marketplace interno de Universidad ORT Uruguay fue creada correctamente.</p>
      <p>Ya puedes explorar publicaciones y compartir tus propios productos o servicios con la comunidad universitaria.</p>
      <p style="margin-bottom:0;">¡Esperamos que disfrutes la experiencia!</p>
    `),
  });
};

export const sendPublicationReceivedEmail = async ({
  name,
  email,
  publication,
}) => {
  const safeName = escapeHtml(name);
  const safeTitle = escapeHtml(publication.titulo);
  const safeDescription = escapeHtml(publication.descripcion);
  const safeStatus = escapeHtml(publication.estadoPublicacion);
  const safeCategory = escapeHtml(publication.categoria);
  const currency = publication.pesosUy ? "UYU" : "USD";

  await sendEmail({
    to: email,
    subject: `Recibimos tu publicación: ${publication.titulo}`,
    html: layout(`
      <h1 style="margin-top:0;color:#800020;">Recibimos tu publicación</h1>
      <p>Hola ${safeName}, recibimos correctamente la instrucción para crear tu publicación.</p>
      <div style="padding:20px;background:#fafafa;border-left:4px solid #800020;">
        <h2 style="margin:0 0 12px;color:#800020;">${safeTitle}</h2>
        <p style="margin:0 0 8px;"><strong>Descripción:</strong> ${safeDescription}</p>
        <p style="margin:0 0 8px;"><strong>Categoría:</strong> ${safeCategory}</p>
        <p style="margin:0 0 8px;"><strong>Precio:</strong> ${escapeHtml(publication.precio)} ${currency}</p>
        <p style="margin:0;"><strong>Estado:</strong> ${safeStatus}</p>
      </div>
      <p>Puedes consultar más detalles y el estado de tu publicación desde tu perfil.</p>
      <p style="margin-bottom:0;">
        <a href="${escapeHtml(profileUrl)}" style="color:#800020;font-weight:bold;">Ir a mi perfil</a>
      </p>
    `),
  });
};
