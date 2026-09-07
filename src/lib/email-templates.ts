function base(conteudo: string) {
  return `
    <div style="font-family: sans-serif; background:#0b0710; padding:32px; color:#fff;">
      <div style="max-width:480px; margin:0 auto; background:#15101f; border-radius:16px; padding:32px; border:1px solid rgba(255,255,255,0.1);">
        <h1 style="color:#f0abfc; font-size:22px; margin:0 0 24px;">Stella Celeste</h1>
        ${conteudo}
      </div>
    </div>
  `;
}

export function templateBoasVindas(nome: string) {
  return base(`
    <p>Olá, ${nome}!</p>
    <p>Sua conta na Stella Celeste foi criada com sucesso. Agora você já pode agendar suas consultas direto pelo site.</p>
  `);
}

export function templateRecuperarSenha(link: string) {
  return base(`
    <p>Recebemos um pedido para redefinir sua senha.</p>
    <p>Clique no link abaixo para criar uma nova senha (o link expira em 1 hora):</p>
    <p><a href="${link}" style="color:#f0abfc;">Redefinir minha senha</a></p>
    <p style="color:#999; font-size:13px;">Se você não pediu isso, pode ignorar este e-mail com segurança.</p>
  `);
}

export function templateReservaCliente(servico: string, dataFormatada: string, horario: string) {
  return base(`
    <p>Seu agendamento foi confirmado!</p>
    <p><strong>Serviço:</strong> ${servico}<br/>
    <strong>Data:</strong> ${dataFormatada} às ${horario}</p>
    <p>O pagamento é combinado diretamente com a Stella Celeste.</p>
  `);
}

export function templateReservaAdmin(cliente: string, servico: string, dataFormatada: string, horario: string) {
  return base(`
    <p>Novo agendamento recebido!</p>
    <p><strong>Cliente:</strong> ${cliente}<br/>
    <strong>Serviço:</strong> ${servico}<br/>
    <strong>Data:</strong> ${dataFormatada} às ${horario}</p>
  `);
}

export function templateAvaliacaoAprovada() {
  return base(`
    <p>Boas notícias! Sua avaliação foi aprovada e já está publicada no site da Stella Celeste. Obrigado por compartilhar sua experiência ✦</p>
  `);
}
