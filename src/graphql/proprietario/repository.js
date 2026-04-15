import prisma from "../../lib/prisma.js";

class ProprietarioRepository {
  async create(data) {
    const proprietario = await prisma.proprietario.create({
      data: {
        nome: data.nome,
        email: data.email,
      },
      include: {
        endereco: true,
      },
    });
    return proprietario;
  }

  async findById(id) {
    const proprietario = await prisma.proprietario.findUnique({
      where: { id: id },
      include: {
        endereco: true,
        alugueis: {
          include: {
            usuario: true,
            pagamento: true,
            avaliacoes: true,
          },
        },
      },
    });
    return proprietario;
  }

  async findAll() {
    const proprietarios = await prisma.proprietario.findMany({
      include: {
        endereco: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return proprietarios;
  }

  async update(id, data) {
    const updateData = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.enderecoId !== undefined) updateData.enderecoId = data.enderecoId;

    const proprietario = await prisma.proprietario.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        endereco: true,
      },
    });
    return proprietario;
  }

  async delete(id) {
    const proprietario = await prisma.proprietario.delete({
      where: { id: parseInt(id) },
    });
    return proprietario;
  }
}

export default new ProprietarioRepository();
