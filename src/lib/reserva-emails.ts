import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email";
import { templateReservaCliente, templatePagamentoConfirmadoAdmin } from "@/lib/email-templates";

// Manda os e-mails de "pagamento confirmado" (cliente e admin) de uma reserva.
// Chamar SOMENTE no momento em que a reserva passa a "pago" — pelo webhook do
// Mercado Pago ou pela mudança manual no painel. Use dentro de `after()` para
// não atrasar a resposta.
export async function enviarEmailsReservaPaga(reservaId: string) {
  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
    include: {
      cliente: { select: { name: true, email: true } },
      servico: { select: { name: true } },
      horario: { select: { data: true, time: true } },
    },
  });
  if (!reserva || reserva.status !== "pago") return;

  const dataFormatada = new Date(reserva.horario.data).toLocaleDateString("pt-BR");

  await Promise.all([
    enviarEmail({
      para: reserva.cliente.email,
      assunto: "Pagamento confirmado — agendamento garantido | Stella Celeste",
      html: templateReservaCliente(reserva.servico.name, dataFormatada, reserva.horario.time),
    }),
    process.env.ADMIN_EMAIL
      ? enviarEmail({
          para: process.env.ADMIN_EMAIL,
          assunto: "Pagamento confirmado",
          html: templatePagamentoConfirmadoAdmin(
            reserva.cliente.name,
            reserva.servico.name,
            dataFormatada,
            reserva.horario.time
          ),
        })
      : Promise.resolve(),
  ]);
}
