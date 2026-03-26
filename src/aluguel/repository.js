import prisma from '../lib/prisma.js';

class AluguelRepository {
  async create(data) {
    const aluguel = await prisma.aluguel.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        preco: data.preco,
        dataInicio: new Date(data.dataInicio),
        dataFim: new Date(data.dataFim),
        proprietarioId: data.proprietarioId,
        usuarioId: data.usuarioId
      },
      include: {
        proprietario: true,
        usuario: true
      }
    });
    return aluguel;
  }

  async findById(id) {
    const aluguel = await prisma.aluguel.findUnique({
      where: { id: parseInt(id) },
      include: {
        proprietario: {
          include: {
            endereco: true
          }
        },
        usuario: {
          include: {
            endereco: true
          }
        },
        avaliacoes: {
          include: {
            usuario: true
          }
        },
        pagamento: true
      }
    });
    return aluguel;
  }

  async findAll(skip = 0, take = 10) {
    const alugueis = await prisma.aluguel.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        proprietario: true,
        usuario: true,
        pagamento: true,
        _count: {
          select: {
            avaliacoes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return alugueis;
  }


  async update(id, data) {
    const updateData = {};
    
    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.preco !== undefined) updateData.preco = data.preco;
    if (data.dataInicio !== undefined) updateData.dataInicio = new Date(data.dataInicio);
    if (data.dataFim !== undefined) updateData.dataFim = new Date(data.dataFim);
    if (data.proprietarioId !== undefined) updateData.proprietarioId = data.proprietarioId;
    if (data.usuarioId !== undefined) updateData.usuarioId = data.usuarioId;

    const aluguel = await prisma.aluguel.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        proprietario: true,
        usuario: true
      }
    });
    return aluguel;
  }

  async delete(id) {
    const aluguel = await prisma.aluguel.delete({
      where: { id: parseInt(id) }
    });
    return aluguel;
  }
}

export default new AluguelRepository();