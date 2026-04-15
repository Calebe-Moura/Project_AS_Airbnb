import prisma from "../../lib/prisma.js";

class PagamentoRepository {
  async create(data) {
    const pagamento = await prisma.pagamento.create({
      data: {
        valor: data.valor,
        metodo: data.metodo,
        status: data.status || "PENDENTE",
        dataPagamento: data.dataPagamento ? new Date(data.dataPagamento) : null,
        aluguelId: data.aluguelId,
      },
      include: {
        aluguel: {
          include: {
            proprietario: true,
            usuario: true,
          },
        },
      },
    });
    return pagamento;
  }

  async findById(id) {
    const pagamento = await prisma.pagamento.findUnique({
      where: { id: parseInt(id) },
      include: {
        aluguel: {
          include: {
            proprietario: true,
            usuario: true,
          },
        },
      },
    });
    return pagamento;
  }

  async findByAluguelId(aluguelId) {
    const pagamento = await prisma.pagamento.findUnique({
      where: { aluguelId: parseInt(aluguelId) },
      include: {
        aluguel: true,
      },
    });
    return pagamento;
  }

  async findAll(skip = 0, take = 10) {
    const pagamentos = await prisma.pagamento.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        aluguel: {
          include: {
            proprietario: true,
            usuario: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return pagamentos;
  }

  async findByStatus(status, skip = 0, take = 10) {
    const pagamentos = await prisma.pagamento.findMany({
      where: { status },
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        aluguel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return pagamentos;
  }

  async findByPeriod(startDate, endDate) {
    const pagamentos = await prisma.pagamento.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        aluguel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return pagamentos;
  }

  async update(id, data) {
    const updateData = {};

    if (data.valor !== undefined) updateData.valor = data.valor;
    if (data.metodo !== undefined) updateData.metodo = data.metodo;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.dataPagamento !== undefined) {
      updateData.dataPagamento = data.dataPagamento
        ? new Date(data.dataPagamento)
        : null;
    }
    if (data.aluguelId !== undefined) updateData.aluguelId = data.aluguelId;

    const pagamento = await prisma.pagamento.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        aluguel: true,
      },
    });
    return pagamento;
  }

  async processarPagamento(id) {
    const pagamento = await prisma.pagamento.update({
      where: { id: parseInt(id) },
      data: {
        status: "PAGO",
        dataPagamento: new Date(),
      },
      include: {
        aluguel: true,
      },
    });
    return pagamento;
  }

  async cancelarPagamento(id) {
    const pagamento = await prisma.pagamento.update({
      where: { id: parseInt(id) },
      data: {
        status: "CANCELADO",
      },
      include: {
        aluguel: true,
      },
    });
    return pagamento;
  }

  async delete(id) {
    const pagamento = await prisma.pagamento.delete({
      where: { id: parseInt(id) },
    });
    return pagamento;
  }

  async count() {
    const total = await prisma.pagamento.count();
    return total;
  }

  async getTotalArrecadado() {
    const result = await prisma.pagamento.aggregate({
      where: { status: "PAGO" },
      _sum: {
        valor: true,
      },
    });
    return result._sum.valor || 0;
  }
}

export default new PagamentoRepository();
