import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../../src/lib/prisma.js";
import { calcularDistancia } from "./geo-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar o arquivo proto
const PROTO_PATH = path.join(__dirname, "../proto/imoveis.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const imoveisProto = grpc.loadPackageDefinition(packageDefinition).imoveis;

// Implementação dos serviços
class ImoveisService {
  // Buscar imóveis próximos com base em coordenadas e raio
  async buscarImoveisProximos(call, callback) {
    try {
      const { latitude, longitude, raio_km } = call.request;

      console.log(
        `Buscando imóveis próximos a (${latitude}, ${longitude}) num raio de ${raio_km}km`,
      );

      // Buscar todos os imóveis do banco
      const todosImoveis = await prisma.aluguel.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
        },
        include: {
          proprietario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      // Filtrar imóveis dentro do raio
      const imoveisProximos = todosImoveis
        .map((imovel) => {
          const distancia = calcularDistancia(
            latitude,
            longitude,
            imovel.latitude,
            imovel.longitude,
          );
          return { imovel, distancia };
        })
        .filter((item) => item.distancia <= raio_km)
        .sort((a, b) => a.distancia - b.distancia)
        .map((item) => ({
          id: item.imovel.id,
          titulo: item.imovel.titulo,
          descricao: item.imovel.descricao || "",
          preco_noite: item.imovel.precoNoite,
          latitude: item.imovel.latitude,
          longitude: item.imovel.longitude,
          quartos: item.imovel.quartos,
          banheiros: item.imovel.banheiros,
          capacidade: item.imovel.capacidade,
          distancia_km: item.distancia,
          proprietario: {
            id: item.imovel.proprietario.id,
            nome: item.imovel.proprietario.nome,
            email: item.imovel.proprietario.email,
          },
        }));

      console.log(`Encontrados ${imoveisProximos.length} imóveis próximos`);

      callback(null, {
        imoveis: imoveisProximos,
        total_encontrados: imoveisProximos.length,
      });
    } catch (error) {
      console.error(" Erro ao buscar imóveis:", error);
      callback({
        code: grpc.status.INTERNAL,
        details: "Erro ao buscar imóveis próximos",
      });
    }
  }

  // Buscar imóvel por ID
  async buscarImovelPorId(call, callback) {
    try {
      const { id } = call.request;

      const imovel = await prisma.aluguel.findUnique({
        where: { id },
        include: {
          proprietario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      if (!imovel) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: `Imóvel com ID ${id} não encontrado`,
        });
        return;
      }

      callback(null, {
        id: imovel.id,
        titulo: imovel.titulo,
        descricao: imovel.descricao || "",
        preco_noite: imovel.precoNoite,
        latitude: imovel.latitude || 0,
        longitude: imovel.longitude || 0,
        quartos: imovel.quartos,
        banheiros: imovel.banheiros,
        capacidade: imovel.capacidade,
        distancia_km: 0,
        proprietario: {
          id: imovel.proprietario.id,
          nome: imovel.proprietario.nome,
          email: imovel.proprietario.email,
        },
      });
    } catch (error) {
      console.error(" Erro ao buscar imóvel:", error);
      callback({
        code: grpc.status.INTERNAL,
        details: "Erro ao buscar imóvel",
      });
    }
  }
}

// Iniciar servidor gRPC
function startServer() {
  const server = new grpc.Server();
  const serviceImpl = new ImoveisService();

  server.addService(imoveisProto.ImoveisService.service, {
    buscarImoveisProximos: serviceImpl.buscarImoveisProximos.bind(serviceImpl),
    buscarImovelPorId: serviceImpl.buscarImovelPorId.bind(serviceImpl),
  });

  const port = 50051;
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(" Falha ao iniciar servidor:", err);
        return;
      }
      console.log(` Microsserviço de Imóveis rodando na porta ${port}`);
      console.log(` Métodos disponíveis:`);
      console.log(`- BuscarImoveisProximos(latitude, longitude, raio_km)`);
      console.log(`- BuscarImovelPorId(id)`);
    },
  );

  server.start();
}

startServer();
