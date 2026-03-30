import prisma from '../../lib/prisma.js';

class ImovelDatasource {
  async create(data) {
    const imovel = await prisma.imovel.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        tipoImovel: data.tipoImovel,
        enderecoId: data.enderecoId,
        proprietarioId: data.proprietarioId
      }
    });
    return imovel;
  }

    async findById(id) {
      const imovel = await prisma.imovel.findUnique({
        where: {
          id
        }
      });
      return imovel;
    }

    async findAll() {
      const imoveis = await prisma.imovel.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return imoveis;
    }

    async findEndercoImovel(id) {
      const endereco = await prisma.imovel.findUnique({
        where: {
          id
        },
        select: {
          endereco: true
        }
      });
      return endereco;
    }

}

export default new ImovelDatasource();