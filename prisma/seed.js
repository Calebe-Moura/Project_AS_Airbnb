import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes (ordem correta respeitando foreign keys)
  await prisma.pagamento.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.aluguel.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.proprietario.deleteMany();

  console.log("Dados antigos removidos\n");

  // ==================== CRIAR ENDEREÇOS ====================
  console.log("Criando endereços...");

  const enderecoUsuario = await prisma.endereco.create({
    data: {
      rua: "Av. Atlântica",
      numero: "1234",
      complemento: "Apto 567",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      pais: "Brasil",
      cep: "22021-001",
      latitude: -22.9667,
      longitude: -43.1777,
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
      latitude: -23.5505,
      longitude: -46.6333,
    },
  });

  console.log(`${await prisma.endereco.count()} endereços criados\n`);

  // ==================== CRIAR USUÁRIOS ====================
  console.log("Criando usuários...");

  // Criar usuário primeiro
  const usuario = await prisma.usuario.create({
    data: {
      nome: "Calebe Moura",
      email: "calebe.moura@email.com",
      dataNascimento: new Date("1995-05-15"),
    },
  });

  // Depois associar o endereço ao usuário
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

  console.log(`${await prisma.usuario.count()} usuários criados\n`);

  // ==================== CRIAR PROPRIETÁRIOS ====================
  console.log("Criando proprietários...");

  // Criar proprietário primeiro
  const proprietario = await prisma.proprietario.create({
    data: {
      nome: "Maria Santos",
      email: "maria.santos@email.com",
    },
  });

  // Depois associar o endereço ao proprietário
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

  console.log(`${await prisma.proprietario.count()} proprietários criados\n`);

  // ==================== CRIAR IMÓVEIS (ALUGUEIS) ====================
  console.log("Criando imóveis para aluguel...");

  const aluguel1 = await prisma.aluguel.create({
    data: {
      titulo: "Cobertura Luxuosa com Vista para o Mar",
      descricao:
        "Cobertura completa com 3 suítes, piscina privativa e vista deslumbrante para o mar.",
      preco: 850.0,
      dataInicio: new Date("2024-06-01"),
      dataFim: new Date("2024-06-30"),
      proprietarioId: proprietario.id,
      usuarioId: usuario.id,
    },
  });

  const aluguel2 = await prisma.aluguel.create({
    data: {
      titulo: "Casa na Praia - Temporada",
      descricao:
        "Linda casa a 50 metros da praia, com 2 quartos, churrasqueira e área de lazer.",
      preco: 450.0,
      dataInicio: new Date("2024-07-01"),
      dataFim: new Date("2024-07-15"),
      proprietarioId: proprietario.id,
      usuarioId: usuario2.id,
    },
  });

  const aluguel3 = await prisma.aluguel.create({
    data: {
      titulo: "Apartamento Moderno no Centro",
      descricao:
        "Apartamento moderno e completo, próximo a shoppings e restaurantes.",
      preco: 320.0,
      dataInicio: new Date("2024-08-01"),
      dataFim: new Date("2024-08-10"),
      proprietarioId: proprietario2.id,
      usuarioId: usuario3.id,
    },
  });

  console.log(`${await prisma.aluguel.count()} imóveis cadastrados\n`);

  // ==================== CRIAR PAGAMENTOS ====================
  console.log("Criando pagamentos...");

  await prisma.pagamento.create({
    data: {
      valor: 850.0,
      metodo: "PIX",
      status: "PAGO",
      dataPagamento: new Date("2024-05-25"),
      aluguelId: aluguel1.id,
    },
  });

  await prisma.pagamento.create({
    data: {
      valor: 450.0,
      metodo: "CARTAO",
      status: "PAGO",
      dataPagamento: new Date("2024-06-20"),
      aluguelId: aluguel2.id,
    },
  });

  await prisma.pagamento.create({
    data: {
      valor: 320.0,
      metodo: "BOLETO",
      status: "PENDENTE",
      aluguelId: aluguel3.id,
    },
  });

  console.log(`${await prisma.pagamento.count()} pagamentos registrados\n`);

  // ==================== CRIAR AVALIAÇÕES ====================
  console.log("Criando avaliações...");

  await prisma.avaliacao.create({
    data: {
      nota: 5,
      comentario:
        "Imóvel excepcional! Tudo perfeito, anfitrião muito atencioso.",
      aluguelId: aluguel1.id,
      usuarioId: usuario.id,
    },
  });

  await prisma.avaliacao.create({
    data: {
      nota: 4,
      comentario:
        "Ótima localização, casa confortável. Apenas o chuveiro que demorou um pouco para aquecer.",
      aluguelId: aluguel2.id,
      usuarioId: usuario2.id,
    },
  });

  await prisma.avaliacao.create({
    data: {
      nota: 5,
      comentario:
        "Apartamento muito bem localizado, limpo e organizado. Recomendo!",
      aluguelId: aluguel3.id,
      usuarioId: usuario3.id,
    },
  });

  console.log(`${await prisma.avaliacao.count()} avaliações realizadas\n`);

  // ==================== CONSULTAS DEMONSTRATIVAS ====================
  console.log("=".repeat(60));
  console.log("RESULTADOS DAS CONSULTAS:");
  console.log("=".repeat(60));

  // Listar todos os usuários com seus endereços
  const usuariosComEnderecos = await prisma.usuario.findMany({
    include: { endereco: true },
  });
  console.log("\nUsuários com endereços:");
  usuariosComEnderecos.forEach((user) => {
    console.log(`- ${user.nome} (${user.email})`);
    if (user.endereco) {
      console.log(
        `Endereço: ${user.endereco.rua}, ${user.endereco.numero} - ${user.endereco.cidade}/${user.endereco.estado}`,
      );
    } else {
      console.log(`Endereço: Não cadastrado`);
    }
  });

  // Listar todos os imóveis com proprietários e avaliações
  const imoveisComDetalhes = await prisma.aluguel.findMany({
    include: {
      proprietario: true,
      usuario: true,
      pagamento: true,
      avaliacoes: {
        include: {
          usuario: true,
        },
      },
    },
  });

  console.log("\n🏠 Imóveis disponíveis:");
  imoveisComDetalhes.forEach((imovel) => {
    console.log(`\n${imovel.titulo}`);
    console.log(`Preço: R$ ${imovel.preco}/dia`);
    console.log(
      `Período: ${imovel.dataInicio.toLocaleDateString()} a ${imovel.dataFim.toLocaleDateString()}`,
    );
    console.log(`Proprietário: ${imovel.proprietario.nome}`);
    console.log(`Hospede: ${imovel.usuario.nome}`);
    console.log(
      `Status Pagamento: ${imovel.pagamento?.status || "Não informado"}`,
    );
    if (imovel.avaliacoes.length > 0) {
      console.log(`Avaliações (${imovel.avaliacoes.length}):`);
      imovel.avaliacoes.forEach((avaliacao) => {
        console.log(
          `Nota ${avaliacao.nota}/5 por ${avaliacao.usuario.nome}: "${avaliacao.comentario}"`,
        );
      });
    }
  });

  // Estatísticas gerais
  const totalUsuarios = await prisma.usuario.count();
  const totalProprietarios = await prisma.proprietario.count();
  const totalImoveis = await prisma.aluguel.count();
  const totalAvaliacoes = await prisma.avaliacao.count();
  const totalPagamentos = await prisma.pagamento.count();
  const pagamentosPagos = await prisma.pagamento.count({
    where: { status: "PAGO" },
  });

  console.log("\nEstatísticas do Sistema:");
  console.log(` Usuários: ${totalUsuarios}`);
  console.log(`Proprietários: ${totalProprietarios}`);
  console.log(`Imóveis cadastrados: ${totalImoveis}`);
  console.log(`Avaliações: ${totalAvaliacoes}`);
  console.log(
    `Pagamentos: ${totalPagamentos} (${pagamentosPagos} pagos, ${totalPagamentos - pagamentosPagos} pendentes)`,
  );

  const valorTotalAlugueis = await prisma.pagamento.aggregate({
    where: { status: "PAGO" },
    _sum: { valor: true },
  });
  console.log(
    `Valor total arrecadado: R$ ${valorTotalAlugueis._sum.valor?.toFixed(2) || 0}`,
  );
}

main()
  .then(async () => {
    console.log("\nSeed concluído com sucesso!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("\nErro durante execução do seed:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });