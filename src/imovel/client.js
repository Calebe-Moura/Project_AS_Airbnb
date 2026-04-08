import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/imoveis.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const imoveisProto = grpc.loadPackageDefinition(packageDefinition).imoveis;

const client = new imoveisProto.ImoveisService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

// Exemplo de uso do cliente
async function testarServico() {
  console.log(" Testando Microsserviço de Imóveis...\n");


  console.log(` Buscando imóveis próximos ao centro de São Paulo...`);
  client.buscarImoveisProximos(
    {
      latitude: -23.5505,
      longitude: -46.6333,
      raio_km: 10,
    },
    (error, response) => {
      if (error) {
        console.error("Erro:", error);
        return;
      }

      console.log(`Encontrados ${response.total_encontrados} imóveis:\n`);
      response.imoveis.forEach((imovel, index) => {
        console.log(`${index + 1}. ${imovel.titulo}`);
        console.log(`   Distância: ${imovel.distancia_km}km`);
        console.log(`   Preço: R$ ${imovel.preco_noite}/noite`);
        console.log(`   Capacidade: ${imovel.capacidade} pessoas\n`);
      });
    },
  );

  // Aguardar um pouco para ver o resultado
  setTimeout(() => {
    console.log("\n Buscando imóvel por ID...");
    client.buscarImovelPorId({ id: 1 }, (error, response) => {
      if (error) {
        console.error("Erro:", error);
        return;
      }

      console.log(" Imóvel encontrado:");
      console.log(`   Título: ${response.titulo}`);
      console.log(`   Descrição: ${response.descricao}`);
      console.log(`   Proprietário: ${response.proprietario.nome}`);
    });
  }, 2000);
}

testarServico();
