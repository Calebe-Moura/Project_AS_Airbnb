import aluguelRepository from './repository.js';
import proprietarioRepository from '../proprietario/repository.js';
import usuarioRepository from '../usuario/repository.js';

class AluguelService {
  async createAluguel(data) {
    try {
      const { titulo, descricao, preco, dataInicio, dataFim, proprietarioId, usuarioId } = data;

      if (!titulo || !preco || !dataInicio || !dataFim || !proprietarioId || !usuarioId) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos');
      }

      if (preco <= 0) {
        throw new Error('Preço deve ser maior que zero');
      }

      const dataInicioDate = new Date(dataInicio);
      const dataFimDate = new Date(dataFim);

      if (dataInicioDate >= dataFimDate) {
        throw new Error('Data de início deve ser anterior à data de fim');
      }

      if (dataInicioDate < new Date()) {
        throw new Error('Data de início não pode ser no passado');
      }

      const proprietario = await proprietarioRepository.findById(proprietarioId);
      if (!proprietario) {
        throw new Error('Proprietário não encontrado');
      }

      const usuario = await usuarioRepository.findById(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      const isAvailable = await aluguelRepository.isAvailable(null, dataInicioDate, dataFimDate);
      if (!isAvailable) {
        throw new Error('Imóvel não disponível no período selecionado');
      }

      return await aluguelRepository.create({
        titulo,
        descricao,
        preco,
        dataInicio: dataInicioDate,
        dataFim: dataFimDate,
        proprietarioId,
        usuarioId
      });
    } catch (error) {
      throw new Error(`Erro ao criar aluguel: ${error.message}`);
    }
  }

  async findAluguelById(id) {
    try {
      const aluguel = await aluguelRepository.findById(id);
      if (!aluguel) {
        throw new Error('Aluguel não encontrado');
      }
      return aluguel;
    } catch (error) {
      throw new Error(`Erro ao buscar aluguel: ${error.message}`);
    }
  }

  async findAllAlugueis(skip = 0, take = 10) {
    try {
      const alugueis = await aluguelRepository.findAll(skip, take);
      const total = await aluguelRepository.count();
      
      return {
        data: alugueis,
        total,
        skip: parseInt(skip),
        take: parseInt(take)
      };
    } catch (error) {
      throw new Error(`Erro ao listar aluguéis: ${error.message}`);
    }
  }

  async updateAluguel(id, data) {
    try {
      const aluguel = await aluguelRepository.findById(id);
      if (!aluguel) {
        throw new Error('Aluguel não encontrado');
      }

      const updateData = {};

      if (data.titulo) {
        updateData.titulo = data.titulo;
      }

      if (data.descricao !== undefined) {
        updateData.descricao = data.descricao;
      }

      if (data.preco) {
        if (data.preco <= 0) {
          throw new Error('Preço deve ser maior que zero');
        }
        updateData.preco = data.preco;
      }

      if (data.dataInicio) {
        const dataInicioDate = new Date(data.dataInicio);
        const dataFimDate = data.dataFim ? new Date(data.dataFim) : aluguel.dataFim;
        
        if (dataInicioDate >= dataFimDate) {
          throw new Error('Data de início deve ser anterior à data de fim');
        }
        
        if (dataInicioDate < new Date()) {
          throw new Error('Data de início não pode ser no passado');
        }
        
        updateData.dataInicio = dataInicioDate;
      }

      if (data.dataFim) {
        const dataInicioDate = data.dataInicio ? new Date(data.dataInicio) : aluguel.dataInicio;
        const dataFimDate = new Date(data.dataFim);
        
        if (dataInicioDate >= dataFimDate) {
          throw new Error('Data de início deve ser anterior à data de fim');
        }
        
        updateData.dataFim = dataFimDate;
      }

      if (data.proprietarioId) {
        const proprietario = await proprietarioRepository.findById(data.proprietarioId);
        if (!proprietario) {
          throw new Error('Proprietário não encontrado');
        }
        updateData.proprietarioId = data.proprietarioId;
      }

      if (data.usuarioId) {
        const usuario = await usuarioRepository.findById(data.usuarioId);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }
        updateData.usuarioId = data.usuarioId;
      }

      return await aluguelRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar aluguel: ${error.message}`);
    }
  }

  async deleteAluguel(id) {
    try {
      const aluguel = await aluguelRepository.findById(id);
      if (!aluguel) {
        throw new Error('Aluguel não encontrado');
      }

      if (aluguel.pagamento && aluguel.pagamento.status === 'PAGO') {
        throw new Error('Não é possível deletar aluguel com pagamento confirmado');
      }

      return await aluguelRepository.delete(id);
    } catch (error) {
      throw new Error(`Erro ao deletar aluguel: ${error.message}`);
    }
  }
}

export default new AluguelService();