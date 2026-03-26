import avaliacaoRepository from './repository.js';
import aluguelRepository from '../aluguel/repository.js';
import usuarioRepository from '../usuario/repository.js';

class AvaliacaoService {
  async createAvaliacao(data) {
    try {
      const { nota, comentario, aluguelId, usuarioId } = data;

      if (!nota || !aluguelId || !usuarioId) {
        throw new Error('Nota, aluguel e usuário são obrigatórios');
      }

      if (nota < 1 || nota > 5) {
        throw new Error('Nota deve ser entre 1 e 5');
      }

      const aluguel = await aluguelRepository.findById(aluguelId);
      if (!aluguel) {
        throw new Error('Aluguel não encontrado');
      }

      const usuario = await usuarioRepository.findById(usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      if (aluguel.usuarioId !== parseInt(usuarioId)) {
        throw new Error('Apenas o usuário que realizou o aluguel pode avaliar');
      }

      const hasReviewed = await avaliacaoRepository.hasUserReviewed(aluguelId, usuarioId);
      if (hasReviewed) {
        throw new Error('Usuário já avaliou este aluguel');
      }

      const hoje = new Date();
      if (aluguel.dataFim > hoje) {
        throw new Error('Apenas é possível avaliar após o término do período de aluguel');
      }

      return await avaliacaoRepository.create({
        nota,
        comentario,
        aluguelId,
        usuarioId
      });
    } catch (error) {
      throw new Error(`Erro ao criar avaliação: ${error.message}`);
    }
  }

  async findAvaliacaoById(id) {
    try {
      const avaliacao = await avaliacaoRepository.findById(id);
      if (!avaliacao) {
        throw new Error('Avaliação não encontrada');
      }
      return avaliacao;
    } catch (error) {
      throw new Error(`Erro ao buscar avaliação: ${error.message}`);
    }
  }

  async findAllAvaliacoes(skip = 0, take = 10) {
    try {
      const avaliacoes = await avaliacaoRepository.findAll(skip, take);
      const total = await avaliacaoRepository.count();
      
      return {
        data: avaliacoes,
        total,
        skip: parseInt(skip),
        take: parseInt(take)
      };
    } catch (error) {
      throw new Error(`Erro ao listar avaliações: ${error.message}`);
    }
  }

  async updateAvaliacao(id, data) {
    try {
      const avaliacao = await avaliacaoRepository.findById(id);
      if (!avaliacao) {
        throw new Error('Avaliação não encontrada');
      }

      const updateData = {};

      if (data.nota) {
        if (data.nota < 1 || data.nota > 5) {
          throw new Error('Nota deve ser entre 1 e 5');
        }
        updateData.nota = data.nota;
      }

      if (data.comentario !== undefined) {
        updateData.comentario = data.comentario;
      }

      if (data.aluguelId) {
        const aluguel = await aluguelRepository.findById(data.aluguelId);
        if (!aluguel) {
          throw new Error('Aluguel não encontrado');
        }
        updateData.aluguelId = data.aluguelId;
      }

      if (data.usuarioId) {
        const usuario = await usuarioRepository.findById(data.usuarioId);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }
        updateData.usuarioId = data.usuarioId;
      }

      return await avaliacaoRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar avaliação: ${error.message}`);
    }
  }

  async deleteAvaliacao(id) {
    try {
      const avaliacao = await avaliacaoRepository.findById(id);
      if (!avaliacao) {
        throw new Error('Avaliação não encontrada');
      }

      return await avaliacaoRepository.delete(id);
    } catch (error) {
      throw new Error(`Erro ao deletar avaliação: ${error.message}`);
    }
  }
  
}

export default new AvaliacaoService();