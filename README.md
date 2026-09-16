# Stella Celeste

Site de agendamento e atendimento para serviços de cartomancia — com área
pública para clientes agendarem horários e um painel administrativo completo
para gerenciar serviços, disponibilidade, reservas, avaliações e financeiro.

## Funcionalidades

**Área pública**
- Home com hero, seção sobre, serviços com busca, disponibilidade semanal
  (horários clicáveis organizados por semana), depoimentos aprovados, FAQ e
  contato via WhatsApp
- Cadastro e login de cliente, com recuperação de senha por e-mail
- Fluxo de agendamento: escolha de serviço + horário, agrupado por semana
  ("Semana atual", "Próxima semana"...)
- Pagamento online via Pix, cartão ou boleto (Mercado Pago — Checkout Pro)
- Minha Conta: editar dados, foto de perfil, biografia, histórico de
  atendimentos e avaliação do site
- Layout responsivo (menu hambúrguer no mobile)

**Painel administrativo**
- Login separado do cliente
- Dashboard com visão geral
- Serviços (CRUD)
- Vagas / Disponibilidade Semanal — gera automaticamente os horários reais
  das próximas 4 semanas a partir de uma recorrência ("toda Segunda às 14h")
- Reservas — marcar como pago/cancelado, acompanhar status
- Avaliações — aprovar ou recusar depoimentos de clientes
- Clientes (CRUD)
- Financeiro — resumo por dia/semana/mês/ano, gráficos e exportação em
  PDF, Excel e Word
- Configurações

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Prisma 7](https://www.prisma.io/) + [Postgres/Neon](https://neon.tech/)
- [Resend](https://resend.com/) para e-mails transacionais
- [Mercado Pago](https://www.mercadopago.com.br/developers) para pagamento
  online (Pix / cartão / boleto)
- Deploy na [Vercel](https://vercel.com/)

## Configuração local

### Pré-requisitos
- Node.js 20+
- Um banco Postgres (recomendado: [Neon](https://neon.tech/), tem plano
  gratuito)

### Passos

```bash
# instalar dependências
npm install

# copiar o arquivo de variáveis de ambiente
cp .env.example .env.local
```

Preencha o `.env.local`:

| Variável | Obrigatória? | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | Connection string do Postgres (Neon) |
| `SESSION_SECRET` | Sim | String aleatória longa, usada para assinar a sessão de login |
| `RESEND_API_KEY` | Sim | Chave da API do Resend, para envio de e-mails |
| `ADMIN_EMAIL` | Não | E-mail que recebe notificação de novos agendamentos |
| `NEXT_PUBLIC_APP_URL` | Não* | URL pública do site (usada em links de e-mail e no retorno do pagamento) |
| `MERCADOPAGO_ACCESS_TOKEN` | Não* | Access Token do Mercado Pago — sem ela, o pagamento online fica desligado e o admin marca "pago" manualmente |

\* Recomendado preencher em produção.

Depois, gere o client do Prisma e aplique o schema no banco:

```bash
npx prisma generate
npx prisma db push
```

E rode o projeto:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy

O projeto está preparado para deploy na Vercel:
1. Importar o repositório na Vercel
2. Configurar as mesmas variáveis de ambiente do `.env.example` nas
   configurações do projeto
3. Deploy automático a cada push na branch principal

### Pendências conhecidas
- **Pagamento**: o código do Mercado Pago já está pronto (Checkout Pro); falta
  configurar as credenciais reais (teste e depois produção)
- **Domínio próprio**: o Resend está em modo sandbox — e-mails automáticos só
  chegam para o endereço cadastrado no Resend até haver um domínio próprio
  configurado
- **Testes de ponta a ponta**: revisar todos os fluxos (cliente e admin) após
  as últimas mudanças estruturais
