// Número de WhatsApp real da Stella Celeste.
export const WHATSAPP_NUMERO = "5598981773791";

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const EMAIL_CONTATO = "estrelaceleste91@gmail.com";

export const INSTAGRAM_URL = "https://www.instagram.com/cleopatra_stella_/";
export const INSTAGRAM_HANDLE = "@cleopatra_stella_";
