import prisma from "../../lib/prisma.js";

class AvaliacaoRepository {
  async create(data) {
    const avaliacao = await prisma.avaliacao.create({
      data: {
        nota: data.nota,
        comentario: data.comentario,
        aluguelId: data.aluguelId,
        usuarioId: data.usuarioId,
      },
      include: {
        usuario: true,
        aluguel: {
          include: {
            proprietario: true,
          },
        },
      },
    });
    return avaliacao;
  }

  async findById(id) {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: true,
        aluguel: {
          include: {
            proprietario: true,
          },
        },
      },
    });
    return avaliacao;
  }

  async findAll(skip = 0, take = 10) {
    const avaliacoes = await prisma.avaliacao.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        usuario: true,
        aluguel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return avaliacoes;
  }

  async update(id, data) {
    const updateData = {};

    if (data.nota !== undefined) updateData.nota = data.nota;
    if (data.comentario !== undefined) updateData.comentario = data.comentario;
    if (data.aluguelId !== undefined) updateData.aluguelId = data.aluguelId;
    if (data.usuarioId !== undefined) updateData.usuarioId = data.usuarioId;

    const avaliacao = await prisma.avaliacao.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        usuario: true,
        aluguel: true,
      },
    });
    return avaliacao;
  }

  async delete(id) {
    const avaliacao = await prisma.avaliacao.delete({
      where: { id: parseInt(id) },
    });
    return avaliacao;
  }
}

export default new AvaliacaoRepository();
