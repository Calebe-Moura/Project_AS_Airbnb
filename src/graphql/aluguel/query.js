import aluguelService from "../aluguel/service.js";

export const aluguelQueryResolvers = {
  alugueis: async () => {
    return aluguelService.findAllAlugueis( );
  },

  aluguel: async (_, { id }) => {
    return aluguelService.findAluguelById(id);
  },
};

export default aluguelQueryResolvers;
