/**
 * Templates de email da Stella Celeste
 * Visual místico/feminino: fundo escuro com constelações, lua dourada,
 * tipografia serifada e detalhes em rosa/magenta (#f0abfc).
 *
 * Mantém as mesmas funções exportadas e assinaturas do arquivo original,
 * então basta substituir o arquivo — nenhuma chamada precisa mudar.
 */

// ---------- Peças reutilizáveis ----------

function moonIcon() {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 18px auto;">
      <tr>
        <td width="56" height="56" style="width:56px; height:56px; border-radius:50%; background: radial-gradient(circle at 35% 35%, #fbe4ff, #d78ce9 70%); box-shadow: 0 0 24px rgba(240, 171, 252, 0.5);">
        </td>
      </tr>
    </table>
  `;
}

function starsDivider() {
  return `
    <tr>
      <td align="center" style="padding: 0 48px 8px 48px;">
        <div style="font-size:14px; color:#7a5d87; letter-spacing:6px;">✦ ✧ ✦</div>
      </td>
    </tr>
  `;
}

function ctaButton(texto: string, url: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 8px auto 0 auto;">
      <tr>
        <td style="border-radius: 30px; background: linear-gradient(135deg, #f0abfc, #a855f7); box-shadow: 0 6px 18px rgba(168, 85, 247, 0.4);">
          <a href="${url}" target="_blank" style="display:inline-block; padding: 15px 40px; font-family: 'Trebuchet MS', Verdana, sans-serif; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #1a0f28; text-decoration: none; border-radius: 30px; font-weight: bold;">
            ${texto}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function detailCard(linhas: { label: string; valor: string }[]) {
  const linhasHtml = linhas
    .map(
      (linha, i) => `
      <tr>
        <td style="padding: 22px 26px; font-family: 'Trebuchet MS', Verdana, sans-serif; font-size: 14px; color: #a892b8; text-transform: uppercase; letter-spacing: 1px; width: 40%; ${
          i < linhas.length - 1 ? 'border-bottom: 1px solid rgba(240,171,252,0.15);' : ''
        }">
          ${linha.label}
        </td>
        <td style="padding: 22px 26px; font-family: Georgia, serif; font-size: 15px; color: #fbe9ff; ${
          i < linhas.length - 1 ? 'border-bottom: 1px solid rgba(240,171,252,0.15);' : ''
        }">
          ${linha.valor}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <tr>
      <td style="padding: 0 48px 30px 48px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(240,171,252,0.06); border: 1px solid rgba(240,171,252,0.2); border-radius: 14px;">
          ${linhasHtml}
        </table>
      </td>
    </tr>
  `;
}

// ---------- Estrutura base do email ----------

function base(
  titulo: string,
  conteudo: string,
  rodapeTexto: string,
  fraseAssinatura: string,
  secoesExtras: string = ''
) {
  return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${titulo} — Stella Celeste</title>
<!--[if mso]>
<noscript>
<xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
</noscript>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
  @media screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .fluid-padding { padding-left: 20px !important; padding-right: 20px !important; }
    .stack-title { font-size: 24px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#0b0710; font-family: Georgia, 'Times New Roman', serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0710; background-image: radial-gradient(circle at 15% 15%, rgba(240,171,252,0.08) 0%, transparent 45%), radial-gradient(circle at 88% 20%, rgba(255,215,158,0.06) 0%, transparent 40%), radial-gradient(circle at 50% 95%, rgba(168,85,247,0.08) 0%, transparent 50%);">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#15101f; border-radius:20px; overflow:hidden; border: 1px solid rgba(240,171,252,0.18);">

          <!-- Topo decorativo -->
          <tr>
            <td align="center" style="background: linear-gradient(160deg, #2a1338 0%, #15101f 60%); padding: 44px 24px 28px 24px;" class="fluid-padding">
              <div style="font-size:13px; letter-spacing:5px; color:#f0abfc; text-transform:uppercase; margin-bottom:14px;">
                ✦&nbsp;&nbsp;&nbsp;✧&nbsp;&nbsp;&nbsp;✦
              </div>
              ${moonIcon()}
              <div style="font-family: 'Trebuchet MS', Georgia, serif; font-size:15px; letter-spacing: 4px; color:#f0abfc; text-transform: uppercase; margin-bottom: 6px;">
                Stella Celeste
              </div>
              <div style="width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #f0abfc, transparent); margin: 0 auto;"></div>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td class="fluid-padding" style="padding: 40px 48px 8px 48px; text-align:center;">
              <h1 class="stack-title" style="margin:0 0 18px 0; font-family: Georgia, 'Times New Roman', serif; font-weight: 400; font-size: 28px; line-height: 1.3; color: #fbe9ff; letter-spacing: 0.5px;">
                ${titulo}
              </h1>
              <div style="font-size: 16px; line-height: 1.8; color: #cbb8d6; font-family: 'Trebuchet MS', Verdana, sans-serif; font-weight: 300; text-align:left;">
                ${conteudo}
              </div>
            </td>
          </tr>

          ${secoesExtras}

          ${starsDivider()}

          <!-- Assinatura -->
          <tr>
            <td class="fluid-padding" style="padding: 20px 48px 44px 48px; text-align:center;">
              <p style="margin:0; font-size: 14px; line-height: 1.7; color: #9b859f; font-family: 'Trebuchet MS', Verdana, sans-serif; font-style: italic;">
                "${fraseAssinatura}"
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background-color:#100b18; padding: 26px 32px; text-align:center; border-top: 1px solid rgba(240,171,252,0.12);">
              <p style="margin:0 0 6px 0; font-size: 12px; color:#6f5f78; font-family: 'Trebuchet MS', Verdana, sans-serif; letter-spacing: 1px;">
                Stella Celeste ✦ Consultas & Autoconhecimento
              </p>
              <p style="margin:0; font-size: 11px; color:#4d4152; font-family: 'Trebuchet MS', Verdana, sans-serif;">
                ${rodapeTexto}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ---------- Templates exportados (mesmas assinaturas de antes) ----------

export function templateBoasVindas(nome: string) {
  const conteudo = `
    <p style="text-align:center;">Sua conta na <span style="color:#e9c17a; font-style:italic;">Stella Celeste</span> foi criada com sucesso.
    Os astros já se alinharam e uma nova jornada se abre diante de você.</p>
    <p style="text-align:center;">Agora você já pode agendar suas consultas diretamente pelo site.</p>
  `;
  return base(
    `Olá, ${nome} ✨`,
    conteudo,
    'Você recebeu este email porque criou uma conta em nosso site.',
    'Que cada consulta seja um passo mais próximo da sua própria luz.'
  );
}

export function templateRecuperarSenha(link: string) {
  const conteudo = `
    <p style="text-align:center;">Recebemos um pedido para redefinir sua senha.</p>
    <p style="text-align:center;">Clique no botão abaixo para criar uma nova senha (o link expira em 1 hora):</p>
    <div style="text-align:center; margin: 24px 0 16px;">${ctaButton('Redefinir minha senha', link)}</div>
    <p style="text-align:center; color:#8a7a94; font-size:13px;">Se você não pediu isso, pode ignorar este e-mail com segurança.</p>
  `;
  return base(
    'Redefinir senha 🔑',
    conteudo,
    'Você recebeu este email porque solicitou a redefinição de senha.',
    'Cada novo começo carrega a mesma luz de sempre.'
  );
}

export function templateReservaCliente(servico: string, dataFormatada: string, horario: string) {
  const conteudo = `
    <p style="text-align:center;">Os astros já reservaram esse momento para você. Aqui estão os detalhes da sua consulta:</p>
  `;
  const detalhes = detailCard([
    { label: 'Serviço', valor: servico },
    { label: 'Data', valor: `${dataFormatada} às ${horario}` },
  ]);
  const notaPagamento = `
    <tr>
      <td class="fluid-padding" style="padding: 0 48px 30px 48px; text-align:center;">
        <p style="margin:0; font-style:italic; color:#a892b8; font-size:14px; font-family: 'Trebuchet MS', Verdana, sans-serif;">
          O pagamento é combinado diretamente com a Stella Celeste.
        </p>
      </td>
    </tr>
  `;
  return base(
    'Seu agendamento foi confirmado ✨',
    conteudo,
    'Você recebeu este email porque agendou uma consulta em nosso site.',
    'O universo já preparou o caminho. Basta você chegar.',
    detalhes + notaPagamento
  );
}

export function templateReservaAdmin(cliente: string, servico: string, dataFormatada: string, horario: string) {
  const conteudo = `
    <p style="text-align:center;">Um novo agendamento acaba de chegar.</p>
  `;
  const detalhes = detailCard([
    { label: 'Cliente', valor: cliente },
    { label: 'Serviço', valor: servico },
    { label: 'Data', valor: `${dataFormatada} às ${horario}` },
  ]);
  return base(
    'Novo agendamento recebido 🔔',
    conteudo,
    'Notificação automática do sistema de agendamentos.',
    'Mais uma alma encontra seu caminho até você.',
    detalhes
  );
}

export function templateAvaliacaoAprovada() {
  const conteudo = `
    <div style="text-align:center; font-size: 22px; letter-spacing: 6px; color:#e9c17a; margin-bottom: 10px;">★ ★ ★ ★ ★</div>
    <p style="text-align:center;">Boas notícias! Sua avaliação foi aprovada e já está publicada no site da Stella Celeste.</p>
    <p style="text-align:center;">Obrigada por compartilhar sua experiência <span style="color:#e9c17a;">✦</span></p>
  `;
  return base(
    'Sua avaliação já está no ar ✨',
    conteudo,
    'Você recebeu este email porque avaliou um serviço em nosso site.',
    'Sua voz também ilumina o caminho de quem vem depois.'
  );
}
