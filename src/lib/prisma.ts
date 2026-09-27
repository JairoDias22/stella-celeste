import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// O driver serverless da Neon conversa com o banco via WebSocket. No Node.js
// "normal" (rodando localmente com `npm run dev`, fora do ambiente Edge da
// Vercel), ele precisa que a gente informe qual implementação de WebSocket
// usar — sem isso, a conexão fica pendurada tentando abrir o WebSocket, sem
// nunca dar erro nem completar. É isso que fazia as consultas travarem
// localmente até baterem no nosso timeout, mesmo com o banco saudável.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
