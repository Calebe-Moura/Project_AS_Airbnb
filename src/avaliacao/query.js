import avaliacaoService from './service.js';

export const avaliacaoQueryResolvers = {
  Query: {
    avaliacoes: async (_, { skip = 0, take = 10, filters = {} }) => {
      return avaliacaoService.findAllAvaliacoes(skip, take, filters);
    },
    
    avaliacao: async (_, { id }) => {
      return avaliacaoService.findAvaliacaoById(id);
    }
  }
};

export default avaliacaoQueryResolvers;