import prisma from '../../lib/prisma.js';

class UsuarioRepository {
  async create(data) {
    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        dataNascimento: new Date(data.dataNascimento),
      },
      include: {
        endereco: true,
        alugueis: true,
        avaliacoes: true,
      }
    });
    return usuario;
  }

  async findById(id) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: id },
      include: {
        endereco: true,
        alugueis: {
          include: {
            proprietario: false,
            pagamento: false,
            avaliacoes: false
          }
        },
        avaliacoes: {
          include: {
            aluguel: false
          }
        }
      }
    });
    return usuario;
  }

  async findAll() {
    const usuarios = await prisma.usuario.findMany({
      include: {
        endereco: false,
        alugueis: false,
        avaliacoes: false
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
      where: { id: id }
    });
    return usuario;
  }

}

export default new UsuarioRepository();