import nodemailer from "nodemailer";
import { EMAIL_REMETENTE } from "@/lib/config/email";
import { comTimeout } from "@/lib/utils/timeout";

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

// Envio pelo SMTP do Gmail. Precisa de uma "senha de app" (não é a senha normal
// da conta) — veja o README. Sem as duas variáveis, o e-mail fica desligado.
const transporter =
  gmailUser && gmailAppPassword
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailAppPassword },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
      })
    : null;

/**
 * Envia um e-mail. Se GMAIL_USER / GMAIL_APP_PASSWORD não estiverem
 * configuradas, não envia nada e apenas avisa no log do servidor — não quebra
 * o fluxo do site (cadastro, agendamento etc. continuam funcionando
 * normalmente mesmo sem e-mail configurado).
 */
export async function enviarEmail({
  para,
  assunto,
  html,
}: {
  para: string;
  assunto: string;
  html: string;
}) {
  if (!transporter) {
    console.warn(
      `GMAIL_USER/GMAIL_APP_PASSWORD não configuradas — e-mail "${assunto}" para ${para} não foi enviado.`
    );
    return { success: false, error: "E-mail não configurado." };
  }

  try {
    // Timeout de 10s: se o Gmail travar, a reserva não fica esperando pra
    // sempre — o e-mail simplesmente falha e o agendamento segue normalmente.
    await comTimeout(
      transporter.sendMail({
        from: EMAIL_REMETENTE,
        to: para,
        subject: assunto,
        html,
      }),
      10000,
      "Tempo esgotado ao enviar e-mail"
    );
    return { success: true };
  } catch (e) {
    console.error("Erro ao enviar e-mail:", e);
    return { success: false, error: "Falha ao enviar e-mail." };
  }
}
