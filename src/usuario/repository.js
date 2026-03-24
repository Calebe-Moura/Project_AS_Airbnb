import prisma from "../lib/prisma.js";

export async function findAll() {
  return await prisma.usuario.findMany({
    include: { endereco: true },
  });
}

export async function findById(id) {
  return await prisma.usuario.findUnique({
    where: { id },
    include: { endereco: true },
  });
}

export async function create(data) {
  return await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      nascimento: new Date(data.nascimento),
      enderecoid: data.enderecoid,
    },
    include: { endereco: true },
  });
}
const UsuarioRepository = {
  findAll,
  findById,
  create,
};

export default UsuarioRepository