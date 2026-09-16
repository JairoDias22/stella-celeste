import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Enquanto MERCADOPAGO_ACCESS_TOKEN não estiver definida no .env (local ou na
// Vercel), o pagamento online fica "desligado" automaticamente — o resto do
// site continua funcionando normalmente e o admin marca "pago" manualmente,
// como já é hoje. No dia em que você colar a chave real (de teste ou de
// produção) nessa variável, o pagamento passa a funcionar sem precisar mudar
// mais nada no código.
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

export function mercadoPagoConfigurado() {
  return Boolean(ACCESS_TOKEN);
}

let client: MercadoPagoConfig | null = null;

function getClient() {
  if (!ACCESS_TOKEN) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN não está definida no .env — configure antes de usar pagamento online."
    );
  }
  if (!client) {
    client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
  }
  return client;
}

export function getPreferenceClient() {
  return new Preference(getClient());
}

export function getPaymentClient() {
  return new Payment(getClient());
}
