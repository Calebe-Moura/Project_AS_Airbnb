import ImovelDatasource from "./repository";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/graphql",
});

async function getEnderecosUsuario(usuarioId) {
  const { data } = await api.post("", {
    query: `
      query ($usuarioId: ID!) {
        endereco(usuarioId: $usuarioId) {
          cep
          numero
          latitude
          longitude
        }
      }
    `,
    variables: {
      usuarioId,
    },
  });

  if (data.errors) {
    throw new Error(JSON.stringify(data.errors));
  }

  return data.data.endereco;
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

class ImovelService {
  async create(data) {
    try {
      const imovel = await ImovelDatasource.create(data);
      return imovel;
    } catch (error) {
      throw new Error("Erro ao criar imóvel");
    }
  }

  async findImovelById(id) {
    try {
      const imovel = await ImovelDatasource.findById(id);
      return imovel;
    } catch (error) {
      throw new Error("Erro ao encontrar imóvel");
    }
  }

  async findAllImovel() {
    try {
      const imoveis = await ImovelDatasource.findAll();
      return imoveis;
    } catch (error) {
      throw new Error("Erro ao listar imóveis");
    }
  }

  async getImoveisProximos({ usuarioId, latitude, longitude, raioKm = 5 }) {
    try {
      const enderecos = await getEnderecosUsuario(usuarioId);

      const imoveis = await ImovelDatasource.findAll();

      const imoveisProximos = imoveis.filter((imovel) => {
        const endereco = enderecos.find((e) => e.id === imovel.enderecoId);

        if (!endereco) return false;

        const distancia = calcularDistancia(
          latitude,
          longitude,
          endereco.latitude,
          endereco.longitude,
        );

        return distancia <= raioKm;
      });

      return imoveisProximos;
    } catch (error) {
      throw new Error("Erro ao buscar imóveis próximos");
    }
  }

  async findEnderecoImovel(id) {
    try {
      const endereco = await ImovelDatasource.findEndercoImovel(id);
      return endereco;
    } catch (error) {
      throw new Error("Erro ao buscar endereço do imóvel");
    }
  }
}
export default new ImovelService();
