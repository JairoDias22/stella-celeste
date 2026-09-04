// TROQUE pelo número de WhatsApp real da Stella Celeste, no formato internacional,
// só números (código do país + DDD + número), sem espaços, traços ou parênteses.
// Exemplo para um número de São Paulo (11) 91234-5678: "5511912345678"
export const WHATSAPP_NUMERO = "5599884873311";

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}
