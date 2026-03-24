import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.endereco.deleteMany();
  await prisma.usuario.deleteMany();

  // Endereco
  const endereco = await prisma.endereco.create({
    data: {
      rua: "AV. Washington Luís",
      numero: "88",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "24030250",
    },
  });

  console.log("Created endereco:", endereco);

  // Usuario
  const user = await prisma.usuario.create({
    data: {
      nome: "Calebe Moura",
      email: "calebe.moura@prisma.io",
      idade: 25,
      enderecoid: endereco.id,
    },
  });

  console.log("Created user:", user);

  const allUsers = await prisma.usuario.findMany({
    include: { endereco: true },
  });

  console.log("All users with addresses:", JSON.stringify(allUsers, null, 2));

  const allEnderecos = await prisma.endereco.findMany();
  console.log("All enderecos:", JSON.stringify(allEnderecos, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
