import pagamentoService from '../pagamento/service.js';

export const pagamentoQueryResolvers = {
  Query: {
    pagamentos: async (_, { skip = 0, take = 10, filters = {} }) => {
      return pagamentoService.findAllPagamentos(skip, take, filters);
    },
    
    pagamento: async (_, { id }) => {
      return pagamentoService.findPagamentoById(id);
    }
  }
};

export default pagamentoQueryResolvers;