"use server";

import { prisma } from "@/lib/prisma";
import { getClienteSession } from "@/lib/auth";
import { getPreferenceClient, mercadoPagoConfigurado } from "@/lib/mercadopago";
import { SITE_URL } from "@/lib/config/site";

// Gera o link de pagamento (Checkout Pro) do Mercado Pago pra uma reserva já
// criada. O cliente é redirecionado pra esse link, escolhe Pix, cartão ou
// boleto na própria página do Mercado Pago, e a confirmação volta sozinha
// pelo webhook em /api/pagamento/webhook.
//
// Se as credenciais do Mercado Pago ainda não estiverem configuradas
// (MERCADOPAGO_ACCESS_TOKEN vazia), retorna configurado: false — quem chamar
// essa função deve simplesmente seguir o fluxo antigo (reserva fica
// "pendente" e o admin marca "pago" manualmente depois).
export async function criarPagamentoReserva(reservaId: string) {
  if (!mercadoPagoConfigurado()) {
    return { success: false, configurado: false as const };
  }

  const session = await getClienteSession();
  if (!session) {
    return { success: false, configurado: true as const, error: "Sessão expirada. Faça login novamente." };
  }

  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
    include: { servico: true },
  });

  if (!reserva) {
    return { success: false, configurado: true as const, error: "Reserva não encontrada." };
  }
  if (reserva.clienteId !== session.id) {
    return { success: false, configurado: true as const, error: "Essa reserva não pertence a essa conta." };
  }
  if (reserva.status !== "pendente") {
    return { success: false, configurado: true as const, error: "Essa reserva já não está mais pendente de pagamento." };
  }

  try {
    const preference = await getPreferenceClient().create({
      body: {
        items: [
          {
            id: reserva.servicoId,
            title: reserva.servico.name,
            quantity: 1,
            unit_price: Number(reserva.valor),
            currency_id: "BRL",
          },
        ],
        payer: { email: session.email },
        external_reference: reserva.id,
        notification_url: `${SITE_URL}/api/pagamento/webhook`,
        back_urls: {
          success: `${SITE_URL}/minha-conta?pagamento=sucesso`,
          pending: `${SITE_URL}/minha-conta?pagamento=pendente`,
          failure: `${SITE_URL}/minha-conta?pagamento=falha`,
        },
        auto_return: "approved",
      },
    });

    const initPoint = preference.init_point ?? preference.sandbox_init_point;
    if (!initPoint) {
      return { success: false, configurado: true as const, error: "Não foi possível gerar o link de pagamento." };
    }

    return { success: true, configurado: true as const, initPoint };
  } catch (e) {
    console.error("Erro ao criar preferência de pagamento no Mercado Pago:", e);
    return { success: false, configurado: true as const, error: "Não foi possível gerar o link de pagamento agora." };
  }
}
