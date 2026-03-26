import enderecoRepository from './repository.js';
import usuarioRepository from '../usuario/repository.js';
import proprietarioRepository from '../proprietario/repository.js';

class EnderecoService {
  async createEndereco(data) {
    try {
      const { rua, numero, cidade, estado, pais, cep, usuarioId, proprietarioId } = data;

      if (!rua || !numero || !cidade || !estado || !pais || !cep) {
        throw new Error('Rua, número, cidade, estado, país e CEP são obrigatórios');
      }

      if (usuarioId && proprietarioId) {
        throw new Error('Endereço não pode pertencer a usuário e proprietário simultaneamente');
      }

      if (usuarioId) {
        const usuario = await usuarioRepository.findById(usuarioId);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }
        
        if (usuario.enderecoId) {
          throw new Error('Usuário já possui um endereço cadastrado');
        }
      }

      if (proprietarioId) {
        const proprietario = await proprietarioRepository.findById(proprietarioId);
        if (!proprietario) {
          throw new Error('Proprietário não encontrado');
        }
        
        if (proprietario.enderecoId) {
          throw new Error('Proprietário já possui um endereço cadastrado');
        }
      }

      return await enderecoRepository.create({
        rua,
        numero: parseInt(numero),
        complemento: data.complemento,
        cidade,
        estado,
        pais,
        cep,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        usuarioId: usuarioId || null,
        proprietarioId: proprietarioId || null
      });
    } catch (error) {
      throw new Error(`Erro ao criar endereço: ${error.message}`);
    }
  }

  async findEnderecoById(id) {
    try {
      const endereco = await enderecoRepository.findById(id);
      if (!endereco) {
        throw new Error('Endereço não encontrado');
      }
      return endereco;
    } catch (error) {
      throw new Error(`Erro ao buscar endereço: ${error.message}`);
    }
  }

  async findAllEnderecos(skip = 0, take = 10) {
    try {
      const enderecos = await enderecoRepository.findAll(skip, take);
      const total = await enderecoRepository.count();
      
      return {
        data: enderecos,
        total,
        skip: parseInt(skip),
        take: parseInt(take)
      };
    } catch (error) {
      throw new Error(`Erro ao listar endereços: ${error.message}`);
    }
  }

  async updateEndereco(id, data) {
    try {
      const endereco = await enderecoRepository.findById(id);
      if (!endereco) {
        throw new Error('Endereço não encontrado');
      }

      const updateData = {};

      if (data.rua) updateData.rua = data.rua;
      if (data.numero) updateData.numero = parseInt(data.numero);
      if (data.complemento !== undefined) updateData.complemento = data.complemento;
      if (data.cidade) updateData.cidade = data.cidade;
      if (data.estado) updateData.estado = data.estado;
      if (data.pais) updateData.pais = data.pais;
      if (data.cep) updateData.cep = data.cep;
      if (data.latitude !== undefined) updateData.latitude = data.latitude ? parseFloat(data.latitude) : null;
      if (data.longitude !== undefined) updateData.longitude = data.longitude ? parseFloat(data.longitude) : null;

      if (data.usuarioId !== undefined) {
        if (data.usuarioId) {
          const usuario = await usuarioRepository.findById(data.usuarioId);
          if (!usuario) {
            throw new Error('Usuário não encontrado');
          }
          
          if (usuario.enderecoId && usuario.enderecoId !== parseInt(id)) {
            throw new Error('Usuário já possui outro endereço cadastrado');
          }
        }
        updateData.usuarioId = data.usuarioId;
        if (data.usuarioId) updateData.proprietarioId = null;
      }

      if (data.proprietarioId !== undefined) {
        if (data.proprietarioId) {
          const proprietario = await proprietarioRepository.findById(data.proprietarioId);
          if (!proprietario) {
            throw new Error('Proprietário não encontrado');
          }
          
          if (proprietario.enderecoId && proprietario.enderecoId !== parseInt(id)) {
            throw new Error('Proprietário já possui outro endereço cadastrado');
          }
        }
        updateData.proprietarioId = data.proprietarioId;
        if (data.proprietarioId) updateData.usuarioId = null;
      }

      return await enderecoRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar endereço: ${error.message}`);
    }
  }

  async deleteEndereco(id) {
    try {
      const endereco = await enderecoRepository.findById(id);
      if (!endereco) {
        throw new Error('Endereço não encontrado');
      }

      if (endereco.usuarioId) {
        await usuarioRepository.update(endereco.usuarioId, { enderecoId: null });
      }

      if (endereco.proprietarioId) {
        await proprietarioRepository.update(endereco.proprietarioId, { enderecoId: null });
      }

      return await enderecoRepository.delete(id);
    } catch (error) {
      throw new Error(`Erro ao deletar endereço: ${error.message}`);
    }
  }

}

export default new EnderecoService();