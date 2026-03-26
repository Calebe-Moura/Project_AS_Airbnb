import prisma from '../lib/prisma.js';

class EnderecoRepository {
  async create(data) {
    const endereco = await prisma.endereco.create({
      data: {
        rua: data.rua,
        numero: data.numero,
        complemento: data.complemento,
        cidade: data.cidade,
        estado: data.estado,
        pais: data.pais,
        cep: data.cep,
        latitude: data.latitude,
        longitude: data.longitude,
        usuarioId: data.usuarioId || null,
        proprietarioId: data.proprietarioId || null
      },
      include: {
        usuario: true,
        proprietario: true
      }
    });
    return endereco;
  }

  async findById(id) {
    const endereco = await prisma.endereco.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: true,
        proprietario: true
      }
    });
    return endereco;
  }

  async findAll(skip = 0, take = 10) {
    const enderecos = await prisma.endereco.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        usuario: true,
        proprietario: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return enderecos;
  }

  async update(id, data) {
    const updateData = {};
    
    if (data.rua !== undefined) updateData.rua = data.rua;
    if (data.numero !== undefined) updateData.numero = data.numero;
    if (data.complemento !== undefined) updateData.complemento = data.complemento;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.pais !== undefined) updateData.pais = data.pais;
    if (data.cep !== undefined) updateData.cep = data.cep;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.usuarioId !== undefined) updateData.usuarioId = data.usuarioId;
    if (data.proprietarioId !== undefined) updateData.proprietarioId = data.proprietarioId;

    const endereco = await prisma.endereco.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        usuario: true,
        proprietario: true
      }
    });
    return endereco;
  }

  async delete(id) {
    const endereco = await prisma.endereco.delete({
      where: { id: parseInt(id) }
    });
    return endereco;
  }

}

export default new EnderecoRepository();