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
- Pagamento online pelo Mercado Pago (Checkout Pro): cartão, boleto e Pix
  (o Pix só aparece se a conta que recebe tiver uma chave Pix cadastrada)
- Minha Conta: editar dados, foto de perfil, biografia, histórico de
  atendimentos, botão "Pagar agora" em reservas pendentes e avaliação do site
- Depoimentos clicáveis: cada depoimento aprovado leva a uma página pública
  (`/perfil/...`) com nome, foto, bio, "cliente desde", consultas realizadas e
  o depoimento — para mostrar que a avaliação é de uma pessoa real. Nunca exibe
  e-mail ou telefone, só existe enquanto a avaliação estiver aprovada e não é
  indexada por buscadores
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
- [Nodemailer](https://nodemailer.com/) + Gmail (SMTP) para e-mails transacionais
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
| `GMAIL_USER` | Sim | Endereço do Gmail usado pelo site para enviar e-mails |
| `GMAIL_APP_PASSWORD` | Sim | Senha de app de 16 caracteres do Gmail (não é a senha normal) |
| `ADMIN_EMAIL` | Não | E-mail que recebe os avisos de nova reserva e de pagamento confirmado |
| `NEXT_PUBLIC_APP_URL` | Não* | URL pública do site (usada em links de e-mail e no retorno do pagamento) |
| `MERCADOPAGO_ACCESS_TOKEN` | Não* | Access Token do Mercado Pago (de teste ou de produção) — sem ele, o pagamento online fica desligado e o admin marca "pago" manualmente |

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

## Como funcionam reservas, pagamento e e-mails

1. O cliente escolhe serviço e horário e confirma. A reserva é criada como
   **pendente** e o horário fica bloqueado. Nesse momento o cliente recebe o
   e-mail **"Reserva recebida — falta o pagamento"** (não é confirmação) e a
   Stella recebe o aviso de reserva aguardando pagamento.
2. O cliente é levado à página de pagamento do Mercado Pago. Se fechar a
   página ou o pagamento for recusado, a reserva continua pendente e ele pode
   tentar de novo pelo botão **Pagar agora** em "Minha conta".
3. Quando o Mercado Pago aprova o pagamento, ele avisa o site pelo webhook
   (`/api/pagamento/webhook`). O site consulta o pagamento de volta na API do
   Mercado Pago antes de confiar no aviso, marca a reserva como **paga** e só
   então envia o e-mail **"Pagamento confirmado"** ao cliente e à Stella.
   Se a Stella marcar a reserva como paga à mão no painel (ex.: pagamento por
   fora), os mesmos e-mails de confirmação são enviados.

Regra de ouro para a Stella: o e-mail não é prova de pagamento. O que vale é o
status **Pago** da reserva no painel administrativo (`/admin/reservas`). Se um
cliente disser que pagou e a reserva estiver pendente, o atendimento não está
garantido.

O painel administrativo não aparece em nenhum menu de propósito; o acesso é
pelo endereço `/admin/login`.

## Testando o pagamento (modo de teste)

1. Em [Mercado Pago Developers](https://www.mercadopago.com.br/developers), em
   "Suas integrações", crie a aplicação (Checkout Pro). Uma conta vendedora de
   teste é criada junto, e as **credenciais de teste** da aplicação pertencem
   a ela.
2. Copie o Access Token de teste para `MERCADOPAGO_ACCESS_TOKEN` (na Vercel,
   faça um novo deploy depois de alterar a variável).
3. Na página da aplicação, em "Contas de teste", crie uma conta do tipo
   **Comprador** (país Brasil). Ela gera um usuário e uma senha fictícios.
4. Em uma janela anônima, entre no Mercado Pago com essa conta compradora de
   teste, faça um agendamento no site e pague (com o saldo da conta de teste,
   ou com os cartões de teste da documentação do Mercado Pago).

Limitações do modo de teste, já observadas:
- Pagar como visitante (só com os dados de um cartão de teste, sem entrar na
  conta compradora de teste) é recusado com a mensagem "Uma das partes com as
  quais você está tentando efetuar o pagamento é de teste", porque o vendedor
  é de teste e o comprador não. Isso não é defeito do site.
- Pix não pode ser pago em ambiente de teste, e boleto só foi testado até a
  geração; não foi possível simular o pagamento dele.

## Deploy

O projeto está preparado para deploy na Vercel:
1. Importar o repositório na Vercel
2. Configurar as mesmas variáveis de ambiente do `.env.example` nas
   configurações do projeto
3. Deploy automático a cada push na branch principal

Variáveis de ambiente só passam a valer em um **novo deploy**.

## Para colocar em produção (pendências que dependem da Stella)

- [ ] **Conta do Mercado Pago da Stella**: é ela quem recebe o dinheiro, então
  a conta (e os dados pessoais e bancários) precisa ser dela. Criar a aplicação
  nessa conta e copiar o Access Token de **produção** para
  `MERCADOPAGO_ACCESS_TOKEN` na Vercel, sem mexer no código.
- [ ] **Chave Pix**: cadastrar uma chave Pix na conta do Mercado Pago dela,
  senão a opção Pix não aparece para os clientes.
- [ ] **Pagamento real de valor baixo**: depois de trocar o token, pagar uma
  vez com cartão de verdade, como visitante, e conferir que a reserva vira
  paga e que os e-mails chegam. Precisa ser outra pessoa pagando (o Mercado
  Pago não aceita pagar para si mesmo); o valor pode ser estornado depois pelo
  painel do Mercado Pago.
- [ ] **Boletos não pagos**: o boleto leva alguns dias úteis para ser
  compensado e a reserva fica pendente (com o horário ocupado) enquanto isso.
  O site não cancela reservas pendentes sozinho; combinar como a Stella vai
  acompanhar e cancelar essas reservas.
- [ ] **E-mail**: hoje sai por uma conta Gmail dedicada ao site (senha de app;
  limite de algumas centenas de envios por dia). Esses e-mails podem cair no
  spam no começo; o site já avisa os clientes para conferirem. Para remetente
  profissional, migrar para um serviço com domínio próprio verificado (SPF e
  DKIM). Se a senha normal da conta Google for trocada, as senhas de app são
  canceladas e é preciso gerar outra.
- [ ] **Domínio próprio** (opcional): decisão e custo da Stella. Depois de
  registrado, atualizar `NEXT_PUBLIC_APP_URL` na Vercel.
- [ ] Remover `RESEND_API_KEY` da Vercel, se ainda existir (o site não usa mais).

### Pendências conhecidas do desenvolvimento
- **Desempenho no celular**: o site ainda pode travar/ficar lento em telas
  menores; revisar
- **Testes de ponta a ponta**: revisar todos os fluxos (cliente e admin) após
  as últimas mudanças
- **Identidade visual**: decidir entre manter o violeta/rosa na home ou adotar
  a paleta dourada do hero em todo o site
