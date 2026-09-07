// Troque pelo domínio final do site assim que tiver um (ex: "https://stellaceleste.com"
// ou o domínio fixo da Vercel, tipo "https://stella-celeste.vercel.app").
// Também dá pra configurar via variável de ambiente NEXT_PUBLIC_APP_URL, sem precisar
// mexer neste arquivo.
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://stella-celeste.vercel.app";
