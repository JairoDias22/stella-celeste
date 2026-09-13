// Formata uma data (vinda do banco como um valor "só data", tipo Horario.data)
// sempre usando os componentes UTC — isso evita que o fuso horário de onde o
// código roda (navegador do cliente ou servidor) desloque o dia mostrado.
export function formatarDataUTC(data: Date, comAno = true): string {
  const d = new Date(data);
  const dia = String(d.getUTCDate()).padStart(2, "0");
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  return comAno ? `${dia}/${mes}/${d.getUTCFullYear()}` : `${dia}/${mes}`;
}
