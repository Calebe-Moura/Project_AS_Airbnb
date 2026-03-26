import aluguelService from '../aluguel/service.js';

export const aluguelQueryResolvers = {
  Query: {
    alugueis: async (_, { skip = 0, take = 10, filters = {} }) => {
      return aluguelService.findAllAlugueis(skip, take, filters);
    },
    
    aluguel: async (_, { id }) => {
      return aluguelService.findAluguelById(id);
    }
  }
};

export default aluguelQueryResolvers;