import ImovelService from "./ImovelService.js";

const ImovelImplementation = {
  
  async createImovel(call, callback) {
    try {
      const { data } = call.request;

      if (!data) {
        return callback({
          code: 3, 
          message: "Dados do imóvel são obrigatórios"
        });
      }

      const imovel = await ImovelService.create(data);

      return callback(null, {
        message: "Imóvel criado com sucesso",
        imovel
      });

    } catch (error) {
      console.error("Erro no gRPC create:", error);

      return callback({
        code: 13, // INTERNAL
        message: error.message || "Erro interno do servidor"
      });
    }
  },

  async findImovelById(call, callback) {
    try {
      const { id } = call.request;

      if (!id) {
        return callback({
          code: 3,
          message: "ID do imóvel é obrigatório"
        });
      }

      const imovel = await ImovelService.findImovelById(id);

      if (!imovel) {
        return callback({
          code: 5, // NOT_FOUND
          message: "Imóvel não encontrado"
        });
      }

      return callback(null, { imovel });

    } catch (error) {
      console.error("Erro no gRPC findById:", error);

      return callback({
        code: 13,
        message: error.message || "Erro interno"
      });
    }
  },

  async findAllImovel(call, callback) {
    try {
      const imoveis = await ImovelService.findAllImovel();

      return callback(null, {
        imoveis,
        total: imoveis.length
      });

    } catch (error) {
      console.error("Erro no gRPC findAll:", error);

      return callback({
        code: 13,
        message: error.message || "Erro interno"
      });
    }
  },

  async getImoveisProximos(call, callback) {
    try {
      const { usuarioId, latitude, longitude, raioKm } = call.request;

      if (!usuarioId) {
        return callback({
          code: 3,
          message: "usuarioId é obrigatório"
        });
      }

      if (latitude === undefined || longitude === undefined) {
        return callback({
          code: 3,
          message: "latitude e longitude são obrigatórios"
        });
      }

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return callback({
          code: 3,
          message: "latitude e longitude devem ser números válidos"
        });
      }

      const raio = raioKm ? parseFloat(raioKm) : 5;

      if (isNaN(raio)) {
        return callback({
          code: 3,
          message: "raioKm deve ser um número válido"
        });
      }

      const imoveis = await ImovelService.getImoveisProximos({
        usuarioId,
        latitude: lat,
        longitude: lng,
        raioKm: raio
      });

      return callback(null, {
        imoveis,
        total: imoveis.length,
        raioKm: raio
      });

    } catch (error) {
      console.error("Erro no gRPC getImoveisProximos:", error);

      return callback({
        code: 13,
        message: error.message || "Erro interno"
      });
    }
  }
};

export default ImovelImplementation;