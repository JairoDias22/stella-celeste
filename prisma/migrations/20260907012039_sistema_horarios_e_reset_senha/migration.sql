/*
  Warnings:

  - You are about to drop the column `vagaId` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the `Vaga` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `horarioId` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_vagaId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resetTokenHash" TEXT;

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resetTokenHash" TEXT;

-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "vagaId",
ADD COLUMN     "horarioId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Vaga";

-- CreateTable
CREATE TABLE "DisponibilidadeSemanal" (
    "id" TEXT NOT NULL,
    "weekday" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisponibilidadeSemanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "weekday" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disponibilidadeId" TEXT NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Horario_disponibilidadeId_data_key" ON "Horario"("disponibilidadeId", "data");

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_disponibilidadeId_fkey" FOREIGN KEY ("disponibilidadeId") REFERENCES "DisponibilidadeSemanal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_horarioId_fkey" FOREIGN KEY ("horarioId") REFERENCES "Horario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
