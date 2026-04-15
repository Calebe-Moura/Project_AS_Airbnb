import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ==================== LIMPAR DADOS ====================
  await prisma.pagamento.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.aluguel.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.proprietario.deleteMany();

  console.log("Dados antigos removidos\n");

  // ==================== ENDEREÇOS ====================
  const enderecoUsuario = await prisma.endereco.create({
    data: {
      rua: "Av. Atlântica",
      numero: "1234",
      complemento: "Apto 567",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      pais: "Brasil",
      cep: "22021-001",
      latitude: new Prisma.Decimal(-22.9667),
      longitude: new Prisma.Decimal(-43.1777),
    },
  });

  const enderecoProprietario = await prisma.endereco.create({
    data: {
      rua: "Rua das Flores",
      numero: "45",
      cidade: "São Paulo",
      estado: "SP",
      pais: "Brasil",
      cep: "01234-567",
      latitude: new Prisma.Decimal(-23.5505),
      longitude: new Prisma.Decimal(-46.6333),
    },
  });

  // ==================== USUÁRIOS ====================
  const usuario = await prisma.usuario.create({
    data: {
      nome: "Calebe Moura",
      email: "calebe.moura@email.com",
      dataNascimento: new Date("1995-05-15"),
    },
  });

  await prisma.endereco.update({
    where: { id: enderecoUsuario.id },
    data: { usuarioId: usuario.id },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nome: "Ana Silva",
      email: "ana.silva@email.com",
      dataNascimento: new Date("1990-08-22"),
    },
  });

  const usuario3 = await prisma.usuario.create({
    data: {
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      dataNascimento: new Date("1988-12-10"),
    },
  });

  // ==================== PROPRIETÁRIOS ====================
  const proprietario = await prisma.proprietario.create({
    data: {
      nome: "Maria Santos",
      email: "maria.santos@email.com",
    },
  });

  await prisma.endereco.update({
    where: { id: enderecoProprietario.id },
    data: { proprietarioId: proprietario.id },
  });

  const proprietario2 = await prisma.proprietario.create({
    data: {
      nome: "João Pereira",
      email: "joao.pereira@email.com",
    },
  });

  // ==================== ALUGUEIS ====================
  const aluguel1 = await prisma.aluguel.create({
    data: {
      titulo: "Cobertura Luxuosa com Vista para o Mar",
      descricao: "Cobertura com piscina e vista para o mar",
      preco: new Prisma.Decimal(850),
      dataInicio: new Date("2024-06-01"),
      dataFim: new Date("2024-06-30"),
      proprietarioId: proprietario.id,
      usuarioId: usuario.id,
    },
  });

  const aluguel2 = await prisma.aluguel.create({
    data: {
      titulo: "Casa na Praia",
      descricao: "Casa a 50m da praia",
      preco: new Prisma.Decimal(450),
      dataInicio: new Date("2024-07-01"),
      dataFim: new Date("2024-07-15"),
      proprietarioId: proprietario.id,
      usuarioId: usuario2.id,
    },
  });

  const aluguel3 = await prisma.aluguel.create({
    data: {
      titulo: "Apartamento no Centro",
      descricao: "Moderno e bem localizado",
      preco: new Prisma.Decimal(320),
      dataInicio: new Date("2024-08-01"),
      dataFim: new Date("2024-08-10"),
      proprietarioId: proprietario2.id,
      usuarioId: usuario3.id,
    },
  });

  // ==================== PAGAMENTOS (AGORA 1:N) ====================
  await prisma.pagamento.createMany({
    data: [
      {
        valor: new Prisma.Decimal(850),
        metodo: "PIX",
        status: "PAGO",
        dataPagamento: new Date("2024-05-25"),
        aluguelId: aluguel1.id,
      },
      {
        valor: new Prisma.Decimal(450),
        metodo: "CARTAO",
        status: "PAGO",
        dataPagamento: new Date("2024-06-20"),
        aluguelId: aluguel2.id,
      },
      {
        valor: new Prisma.Decimal(320),
        metodo: "BOLETO",
        status: "PENDENTE",
        aluguelId: aluguel3.id,
      },
    ],
  });

  // ==================== AVALIAÇÕES ====================
  await prisma.avaliacao.createMany({
    data: [
      {
        nota: 5,
        comentario: "Excelente!",
        aluguelId: aluguel1.id,
        usuarioId: usuario.id,
      },
      {
        nota: 4,
        comentario: "Muito bom",
        aluguelId: aluguel2.id,
        usuarioId: usuario2.id,
      },
      {
        nota: 5,
        comentario: "Perfeito",
        aluguelId: aluguel3.id,
        usuarioId: usuario3.id,
      },
    ],
  });

  // ==================== CONSULTA ====================
  const imoveis = await prisma.aluguel.findMany({
    include: {
      proprietario: true,
      usuario: true,
      pagamentos: true, // 🔥 corrigido aqui
      avaliacoes: {
        include: { usuario: true },
      },
    },
  });

  console.log("\nImóveis:");
  imoveis.forEach((i) => {
    console.log(`\n${i.titulo}`);
    console.log(`Pagamentos: ${i.pagamentos.length}`);
  });

  console.log("\nSeed finalizado com sucesso 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });