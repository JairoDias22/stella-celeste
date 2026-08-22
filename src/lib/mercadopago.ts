import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken && process.env.NODE_ENV !== "test") {
  console.warn(
    "MERCADOPAGO_ACCESS_TOKEN não está definida no .env — o pagamento não vai funcionar até você configurar."
  );
}

const client = new MercadoPagoConfig({
  accessToken: accessToken ?? "",
});

export const mpPreference = new Preference(client);
export const mpPayment = new Payment(client);
