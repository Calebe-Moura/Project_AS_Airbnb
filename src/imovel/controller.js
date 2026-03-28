import ImovelService from "./ImovelService.js";

class ImovelController {
  async createImovel(req, res) {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({
          error: "Dados do imóvel são obrigatórios"
        });
      }

      const imovel = await ImovelService.create(data);
      
      return res.status(201).json({
        message: "Imóvel criado com sucesso",
        imovel
      });
    } catch (error) {
      console.error("Erro no controller create:", error);
      return res.status(500).json({
        error: error.message || "Erro interno do servidor"
      });
    }
  }

  async findImovelById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          error: "ID do imóvel é obrigatório"
        });
      }

      const imovel = await ImovelService.findImovelById(id);
      
      if (!imovel) {
        return res.status(404).json({
          error: "Imóvel não encontrado"
        });
      }
      
      return res.status(200).json({
        imovel
      });
    } catch (error) {
      console.error("Erro no controller findById:", error);
      return res.status(500).json({
        error: error.message || "Erro interno do servidor"
      });
    }
  }

  async findAllImovel(req, res) {
    try {
      const imoveis = await ImovelService.findAllImovel();
      
      return res.status(200).json({
        imoveis,
        total: imoveis.length
      });
    } catch (error) {
      console.error("Erro no controller findAll:", error);
      return res.status(500).json({
        error: error.message || "Erro interno do servidor"
      });
    }
  }

  async getImoveisProximos(req, res) {
    try {
      const { usuarioId, latitude, longitude, raioKm } = req.query;
      
      // Validação dos parâmetros obrigatórios
      if (!usuarioId) {
        return res.status(400).json({
          error: "usuarioId é obrigatório"
        });
      }
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          error: "latitude e longitude são obrigatórios"
        });
      }
      
      // Converte latitude e longitude para números
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          error: "latitude e longitude devem ser números válidos"
        });
      }
      
      const raio = raioKm ? parseFloat(raioKm) : 5;
      
      if (isNaN(raio)) {
        return res.status(400).json({
          error: "raioKm deve ser um número válido"
        });
      }

      const imoveisProximos = await ImovelService.getImoveisProximos({
        usuarioId,
        latitude: lat,
        longitude: lng,
        raioKm: raio
      });
      
      return res.status(200).json({
        imoveis: imoveisProximos,
        total: imoveisProximos.length,
        raioKm: raio
      });
    } catch (error) {
      console.error("Erro no controller getImoveisProximos:", error);
      return res.status(500).json({
        error: error.message || "Erro interno do servidor"
      });
    }
  }
}

export default new ImovelController();