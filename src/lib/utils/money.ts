export function parsePrecoParaNumero(preco: string): number {
  const limpo = preco
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3},)/g, "") // remove pontos de milhar antes da vírgula decimal
    .replace(",", ".");

  const valor = parseFloat(limpo);
  return Number.isFinite(valor) ? valor : 0;
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
