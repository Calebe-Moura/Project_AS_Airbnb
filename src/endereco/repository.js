import prisma from "../lib/prisma.js";

export async function findAll() {
  return await prisma.endereco.findMany();
}

export async function findById(id) {
  return await prisma.endereco.findUnique({
    where: { id },
  });
}

export async function create(data) {
  return await prisma.endereco.create({
    data: {
      rua: data.rua,
      numero: data.numero,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep,
      pais: data.pais,
      longitude: data.longitude,
      latitude: data.latitude,      
    }
  });
}

const EnderecoRepository = {
  findAll,
  findById,
  create,
};

export default EnderecoRepository