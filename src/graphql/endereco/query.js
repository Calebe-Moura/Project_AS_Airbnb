import enderecoService from './service.js';

export const enderecoQueryResolvers = {
  Query: {
    enderecos: async (_, { skip = 0, take = 10, filters = {} }) => {
      return enderecoService.findAllEnderecos(skip, take, filters);
    },
    
    endereco: async (_, { id }) => {
      return enderecoService.findEnderecoById(id);
    }
  }
};

export default enderecoQueryResolvers;