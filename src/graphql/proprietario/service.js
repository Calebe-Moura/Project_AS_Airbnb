import proprietarioRepository from './repository.js';

class ProprietarioService {
  async createProprietario(data) {
    try {
      const { nome, email, enderecoId } = data;

      if (!nome || !email) {
        throw new Error('Nome e email são obrigatórios');
      }

      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }

      const existingProprietario = await proprietarioRepository.findByEmail(email);
      if (existingProprietario) {
        throw new Error('Email já cadastrado');
      }

      return await proprietarioRepository.create({
        nome,
        email,
        enderecoId
      });
    } catch (error) {
      throw new Error(`Erro ao criar proprietário: ${error.message}`);
    }
  }

  async findProprietarioById(id) {
    try {
      const proprietario = await proprietarioRepository.findById(id);
      if (!proprietario) {
        throw new Error('Proprietário não encontrado');
      }
      return proprietario;
    } catch (error) {
      throw new Error(`Erro ao buscar proprietário: ${error.message}`);
    }
  }

  async findAllProprietarios(skip = 0, take = 10) {
    try {
      const proprietarios = await proprietarioRepository.findAll(skip, take);
      const total = await proprietarioRepository.count();
      
      return {
        data: proprietarios,
        total,
        skip: parseInt(skip),
        take: parseInt(take)
      };
    } catch (error) {
      throw new Error(`Erro ao listar proprietários: ${error.message}`);
    }
  }

  async updateProprietario(id, data) {
    try {
      const proprietario = await proprietarioRepository.findById(id);
      if (!proprietario) {
        throw new Error('Proprietário não encontrado');
      }

      const updateData = {};

      if (data.nome) {
        updateData.nome = data.nome;
      }

      if (data.email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new Error('Email inválido');
        }

        const existingProprietario = await proprietarioRepository.findByEmail(data.email);
        if (existingProprietario && existingProprietario.id !== parseInt(id)) {
          throw new Error('Email já cadastrado por outro proprietário');
        }
        updateData.email = data.email;
      }

      if (data.enderecoId !== undefined) {
        updateData.enderecoId = data.enderecoId;
      }

      return await proprietarioRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar proprietário: ${error.message}`);
    }
  }

  async deleteProprietario(id) {
    try {
      const proprietario = await proprietarioRepository.findById(id);
      if (!proprietario) {
        throw new Error('Proprietário não encontrado');
      }

      if (proprietario.alugueis && proprietario.alugueis.length > 0) {
        throw new Error('Não é possível deletar proprietário com imóveis cadastrados');
      }

      return await proprietarioRepository.delete(id);
    } catch (error) {
      throw new Error(`Erro ao deletar proprietário: ${error.message}`);
    }
  }

  
}

export default new ProprietarioService();