// Remetente dos e-mails do site. O Gmail sempre envia a partir da conta
// autenticada (GMAIL_USER), então aqui só definimos o nome exibido.
export const EMAIL_REMETENTE = `Stella Celeste <${process.env.GMAIL_USER ?? "nao-configurado@localhost"}>`;
