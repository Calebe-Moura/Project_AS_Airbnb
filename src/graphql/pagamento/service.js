import pagamentoRepository from "./repository.js";
import aluguelRepository from "../aluguel/repository.js";

class PagamentoService {
  async createPagamento(data) {
    try {
      const { valor, metodo, status, dataPagamento, aluguelId } = data;

      if (!valor || !metodo || !aluguelId) {
        throw new Error("Valor, método e aluguel são obrigatórios");
      }

      if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero");
      }

      const aluguel = await aluguelRepository.findById(aluguelId);
      if (!aluguel) {
        throw new Error("Aluguel não encontrado");
      }

      const existingPagamento =
        await pagamentoRepository.findByAluguelId(aluguelId);
      if (existingPagamento) {
        throw new Error("Este aluguel já possui um pagamento registrado");
      }

      if (dataPagamento && new Date(dataPagamento) > new Date()) {
        throw new Error("Data de pagamento não pode ser no futuro");
      }

      return await pagamentoRepository.create({
        valor,
        metodo,
        status: status || "PENDENTE",
        dataPagamento: dataPagamento ? new Date(dataPagamento) : null,
        aluguelId,
      });
    } catch (error) {
      throw new Error(`Erro ao criar pagamento: ${error.message}`);
    }
  }

  async findPagamentoById(id) {
    try {
      const pagamento = await pagamentoRepository.findById(id);
      if (!pagamento) {
        throw new Error("Pagamento não encontrado");
      }
      return pagamento;
    } catch (error) {
      throw new Error(`Erro ao buscar pagamento: ${error.message}`);
    }
  }

  async findAllPagamentos(skip = 0, take = 10) {
    try {
      const pagamentos = await pagamentoRepository.findAll(skip, take);
      const total = await pagamentoRepository.count();

      return {
        data: pagamentos,
        total,
        skip: parseInt(skip),
        take: parseInt(take),
      };
    } catch (error) {
      throw new Error(`Erro ao listar pagamentos: ${error.message}`);
    }
  }

  async updatePagamento(id, data) {
    try {
      const pagamento = await pagamentoRepository.findById(id);
      if (!pagamento) {
        throw new Error("Pagamento não encontrado");
      }

      const updateData = {};

      if (data.valor) {
        if (data.valor <= 0) {
          throw new Error("Valor deve ser maior que zero");
        }
        updateData.valor = data.valor;
      }

      if (data.metodo) {
        updateData.metodo = data.metodo;
      }

      if (data.status) {
        updateData.status = data.status;
      }

      if (data.dataPagamento !== undefined) {
        if (data.dataPagamento && new Date(data.dataPagamento) > new Date()) {
          throw new Error("Data de pagamento não pode ser no futuro");
        }
        updateData.dataPagamento = data.dataPagamento
          ? new Date(data.dataPagamento)
          : null;
      }

      if (data.aluguelId) {
        const aluguel = await aluguelRepository.findById(data.aluguelId);
        if (!aluguel) {
          throw new Error("Aluguel não encontrado");
        }

        const existingPagamento = await pagamentoRepository.findByAluguelId(
          data.aluguelId,
        );
        if (existingPagamento && existingPagamento.id !== parseInt(id)) {
          throw new Error("Este aluguel já possui um pagamento registrado");
        }
        updateData.aluguelId = data.aluguelId;
      }

      return await pagamentoRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
    }
  }

  async deletePagamento(id) {
    try {
      const pagamento = await pagamentoRepository.findById(id);
      if (!pagamento) {
        throw new Error("Pagamento não encontrado");
      }

      if (pagamento.status === "PAGO") {
        throw new Error("Não é possível deletar um pagamento já realizado");
      }

      return await pagamentoRepository.delete(id);
    } catch (error) {
      throw new Error(`Erro ao deletar pagamento: ${error.message}`);
    }
  }
}

export default new PagamentoService();
