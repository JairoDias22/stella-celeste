import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentClient, mercadoPagoConfigurado } from "@/lib/mercadopago";
import { revalidatePath } from "next/cache";

// O Mercado Pago chama essa rota automaticamente sempre que o status de um
// pagamento muda (aprovado, pendente, etc). Em vez de confiar direto no que
// vem no corpo da notificação, buscamos o pagamento de volta na API do
// Mercado Pago pelo id recebido — assim garantimos que a informação é
// legítima antes de marcar qualquer reserva como paga.
export async function POST(request: NextRequest) {
  if (!mercadoPagoConfigurado()) {
    // Pagamento online ainda não configurado — não deveria receber
    // notificação nenhuma, mas por segurança só confirma o recebimento.
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json().catch(() => null);
    const url = new URL(request.url);

    // O Mercado Pago manda o id do pagamento tanto na query string quanto no
    // corpo, dependendo da versão do webhook — checamos os dois.
    const paymentId =
      body?.data?.id ??
      url.searchParams.get("data.id") ??
      url.searchParams.get("id");

    const topic = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");

    if (!paymentId || topic !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const payment = await getPaymentClient().get({ id: String(paymentId) });

    const reservaId = payment.external_reference;
    if (!reservaId) return NextResponse.json({ ok: true });

    const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
    if (!reserva || reserva.status !== "pendente") {
      return NextResponse.json({ ok: true });
    }

    if (payment.status === "approved") {
      const metodo = payment.payment_method_id === "pix" ? "pix" : "cartao";
      await prisma.reserva.update({
        where: { id: reservaId },
        data: { status: "pago", metodoPagamento: metodo },
      });

      revalidatePath("/minha-conta");
      revalidatePath("/admin/reservas");
      revalidatePath("/admin/financeiro");
      revalidatePath("/admin/dashboard");
    }
    // Outros status (pending, rejected, etc) não mudam a reserva — ela
    // continua "pendente" e o admin ainda pode agir manualmente se precisar.

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao processar webhook do Mercado Pago:", e);
    // Sempre respondemos 200 pro Mercado Pago não ficar tentando reenviar a
    // notificação indefinidamente; o erro já foi registrado no log.
    return NextResponse.json({ ok: true });
  }
}
