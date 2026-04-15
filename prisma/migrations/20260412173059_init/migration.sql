/*
  Warnings:

  - You are about to drop the column `proprietario_id` on the `enderecos` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `enderecos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `enderecos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[proprietarioId]` on the table `enderecos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AluguelStatus" AS ENUM ('ATIVO', 'FINALIZADO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "enderecos" DROP CONSTRAINT "enderecos_proprietario_id_fkey";

-- DropForeignKey
ALTER TABLE "enderecos" DROP CONSTRAINT "enderecos_usuario_id_fkey";

-- DropIndex
DROP INDEX "alugueis_usuario_id_dataInicio_key";

-- DropIndex
DROP INDEX "enderecos_proprietario_id_key";

-- DropIndex
DROP INDEX "enderecos_usuario_id_key";

-- DropIndex
DROP INDEX "pagamentos_aluguel_id_key";

-- AlterTable
ALTER TABLE "alugueis" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "AluguelStatus" NOT NULL DEFAULT 'ATIVO';

-- AlterTable
ALTER TABLE "enderecos" DROP COLUMN "proprietario_id",
DROP COLUMN "usuario_id",
ADD COLUMN     "proprietarioId" UUID,
ADD COLUMN     "usuarioId" UUID;

-- CreateIndex
CREATE INDEX "alugueis_proprietario_id_idx" ON "alugueis"("proprietario_id");

-- CreateIndex
CREATE INDEX "alugueis_usuario_id_idx" ON "alugueis"("usuario_id");

-- CreateIndex
CREATE INDEX "avaliacoes_usuario_id_idx" ON "avaliacoes"("usuario_id");

-- CreateIndex
CREATE INDEX "avaliacoes_aluguel_id_idx" ON "avaliacoes"("aluguel_id");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_usuarioId_key" ON "enderecos"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_proprietarioId_key" ON "enderecos"("proprietarioId");

-- CreateIndex
CREATE INDEX "pagamentos_aluguel_id_idx" ON "pagamentos"("aluguel_id");

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "proprietarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
