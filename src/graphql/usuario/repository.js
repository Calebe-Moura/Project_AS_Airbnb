import prisma from '../../lib/prisma.js';

class UsuarioRepository {
  async create(data) {
    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        dataNascimento: new Date(data.dataNascimento),
        enderecoId: data.enderecoId || null
      },
      include: {
        endereco: true
      }
    });
    return usuario;
  }

  async findById(id) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: {
        endereco: true,
        alugueis: {
          include: {
            proprietario: true,
            pagamento: true,
            avaliacoes: true
          }
        },
        avaliacoes: {
          include: {
            aluguel: true
          }
        }
      }
    });
    return usuario;
  }

  async findAll(skip = 0, take = 10) {
    const usuarios = await prisma.usuario.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        endereco: true,
        _count: {
          select: {
            alugueis: true,
            avaliacoes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return usuarios;
  }

  async update(id, data) {
    const updateData = {};
    
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.dataNascimento !== undefined) {
      updateData.dataNascimento = new Date(data.dataNascimento);
    }
    if (data.enderecoId !== undefined) updateData.enderecoId = data.enderecoId;

    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        endereco: true
      }
    });
    return usuario;
  }

  async delete(id) {
    const usuario = await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });
    return usuario;
  }

}

export default new UsuarioRepository();