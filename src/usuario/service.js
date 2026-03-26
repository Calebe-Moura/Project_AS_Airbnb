import usuarioRepository from './repository.js';

class UsuarioService {
  async createUsuario(data) {
    try {
      const { nome, email, dataNascimento, enderecoId } = data;

      if (!nome || !email || !dataNascimento) {
        throw new Error('Nome, email e data de nascimento são obrigatórios');
      }

      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }

      const existingUser = await usuarioRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      const dataNascimentoDate = new Date(dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNascimentoDate.getFullYear();
      const mes = hoje.getMonth() - dataNascimentoDate.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimentoDate.getDate())) {
        idade--;
      }

      if (idade < 18) {
        throw new Error('Usuário deve ter pelo menos 18 anos');
      }

      return await usuarioRepository.create({
        nome,
        email,
        dataNascimento: dataNascimentoDate,
        enderecoId
      });
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async findUsuarioById(id) {
    try {
      const usuario = await usuarioRepository.findById(id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      return usuario;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  async findAllUsuarios(skip = 0, take = 10) {
    try {
      const usuarios = await usuarioRepository.findAll(skip, take);
      const total = await usuarioRepository.count();
      
      return {
        data: usuarios,
        total,
        skip: parseInt(skip),
        take: parseInt(take)
      };
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error.message}`);
    }
  }

  async updateUsuario(id, data) {
    try {
      const usuario = await usuarioRepository.findById(id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
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

        const existingUser = await usuarioRepository.findByEmail(data.email);
        if (existingUser && existingUser.id !== parseInt(id)) {
          throw new Error('Email já cadastrado por outro usuário');
        }
        updateData.email = data.email;
      }

      if (data.dataNascimento) {
        const dataNascimentoDate = new Date(data.dataNascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimentoDate.getFullYear();
        const mes = hoje.getMonth() - dataNascimentoDate.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimentoDate.getDate())) {
          idade--;
        }

        if (idade < 18) {
          throw new Error('Usuário deve ter pelo menos 18 anos');
        }
        updateData.dataNascimento = dataNascimentoDate;
      }

      if (data.enderecoId !== undefined) {
        updateData.enderecoId = data.enderecoId;
      }

      return await usuarioRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async deleteUsuario(id) {
    try {
      const usuario = await usuarioRepository.findById(id);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      if (usuario.alugueis && usuario.alugueis.length > 0) {
        throw new Error('Não é possível deletar usuário com aluguéis ativos');
      }

      return await usuarioRepository.delete(id);
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

}

export default new UsuarioService();