import { Resend } from "resend";
import { EMAIL_REMETENTE } from "@/lib/config/email";

const apiKey = process.env.RESEND_API_KEY;

const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Envia um e-mail. Se o RESEND_API_KEY não estiver configurado, não envia nada
 * e apenas avisa no log do servidor — não quebra o fluxo do site (cadastro,
 * agendamento etc. continuam funcionando normalmente mesmo sem e-mail configurado).
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
  if (!resend) {
    console.warn(
      `RESEND_API_KEY não configurada — e-mail "${assunto}" para ${para} não foi enviado.`
    );
    return { success: false, error: "E-mail não configurado." };
  }

  try {
    await resend.emails.send({
      from: EMAIL_REMETENTE,
      to: para,
      subject: assunto,
      html,
    });
    return { success: true };
  } catch (e) {
    console.error("Erro ao enviar e-mail:", e);
    return { success: false, error: "Falha ao enviar e-mail." };
  }
}
