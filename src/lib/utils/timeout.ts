// Alguns serviços externos (Resend, Mercado Pago) não têm timeout próprio —
// se a rede travar (Wi-Fi instável, firewall, instabilidade do provedor), o
// `await` fica esperando pra sempre e a tela de "carregando" nunca termina.
// Essa função garante um limite máximo de espera: se o serviço não responder
// a tempo, a promise rejeita e o código que chamou pode tratar como erro
// normal (mostrar mensagem, seguir o fluxo sem aquele passo, etc.) em vez de
// travar a interface indefinidamente.
export function comTimeout<T>(promise: Promise<T>, ms: number, mensagemErro = "Tempo esgotado"): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(mensagemErro)), ms);
    }),
  ]);
}
