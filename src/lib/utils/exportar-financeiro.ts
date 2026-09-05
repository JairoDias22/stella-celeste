import { formatarMoeda } from "./money";

export type LinhaExportacao = {
  data: string;
  cliente: string;
  email: string;
  servico: string;
  valor: number;
  metodoPagamento: string;
};

const TITULOS: Record<string, string> = {
  dia: "Relatório Financeiro — Hoje",
  semana: "Relatório Financeiro — Esta Semana",
  mes: "Relatório Financeiro — Este Mês",
  ano: "Relatório Financeiro — Este Ano",
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function nomeArquivo(periodo: string, extensao: string) {
  const hoje = new Date().toISOString().slice(0, 10);
  return `financeiro-stella-celeste-${periodo}-${hoje}.${extensao}`;
}

export async function exportarPDF(linhas: LinhaExportacao[], periodo: "dia" | "semana" | "mes" | "ano") {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  const total = linhas.reduce((acc, l) => acc + l.valor, 0);

  doc.setFontSize(16);
  doc.text(TITULOS[periodo], 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, 14, 24);

  autoTable(doc, {
    startY: 30,
    head: [["Data", "Cliente", "Serviço", "Método", "Valor"]],
    body: linhas.map((l) => [
      formatarData(l.data),
      l.cliente,
      l.servico,
      l.metodoPagamento,
      formatarMoeda(l.valor),
    ]),
    foot: [["", "", "", "Total", formatarMoeda(total)]],
    headStyles: { fillColor: [124, 58, 237] },
    footStyles: { fillColor: [24, 24, 27], textColor: 255, fontStyle: "bold" },
  });

  doc.save(nomeArquivo(periodo, "pdf"));
}

export async function exportarExcel(linhas: LinhaExportacao[], periodo: "dia" | "semana" | "mes" | "ano") {
  const ExcelJS = (await import("exceljs")).default;
  const { saveAs } = await import("file-saver");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Financeiro");

  sheet.columns = [
    { header: "Data", key: "data", width: 14 },
    { header: "Cliente", key: "cliente", width: 24 },
    { header: "E-mail", key: "email", width: 28 },
    { header: "Serviço", key: "servico", width: 24 },
    { header: "Método", key: "metodoPagamento", width: 12 },
    { header: "Valor", key: "valor", width: 14 },
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF7C3AED" },
  };

  linhas.forEach((l) => {
    sheet.addRow({
      data: formatarData(l.data),
      cliente: l.cliente,
      email: l.email,
      servico: l.servico,
      metodoPagamento: l.metodoPagamento,
      valor: l.valor,
    });
  });

  sheet.getColumn("valor").numFmt = '"R$" #,##0.00';

  const total = linhas.reduce((acc, l) => acc + l.valor, 0);
  const totalRow = sheet.addRow({ servico: "Total", valor: total });
  totalRow.font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), nomeArquivo(periodo, "xlsx"));
}

export async function exportarWord(linhas: LinhaExportacao[], periodo: "dia" | "semana" | "mes" | "ano") {
  const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType } =
    await import("docx");
  const { saveAs } = await import("file-saver");

  const total = linhas.reduce((acc, l) => acc + l.valor, 0);

  const linhaCabecalho = new TableRow({
    children: ["Data", "Cliente", "Serviço", "Método", "Valor"].map(
      (texto) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: texto, bold: true })] })],
        })
    ),
  });

  const linhasTabela = linhas.map(
    (l) =>
      new TableRow({
        children: [
          formatarData(l.data),
          l.cliente,
          l.servico,
          l.metodoPagamento,
          formatarMoeda(l.valor),
        ].map((texto) => new TableCell({ children: [new Paragraph(texto)] })),
      })
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: TITULOS[periodo], heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `Gerado em ${new Date().toLocaleString("pt-BR")}` }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [linhaCabecalho, ...linhasTabela],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun({ text: `Total: ${formatarMoeda(total)}`, bold: true })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, nomeArquivo(periodo, "docx"));
}
