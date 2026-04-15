import proprietarioService from "./service.js";

export const prorietarioQueryResolvers = {
  proprietarios: async () => {
    const proprietarios = await proprietarioService.findAllProprietarios();
    return proprietarios;
  },

  proprietario: async (_, { id }) => {
    return proprietarioService.findProprietarioById(id);
  },
};

export default prorietarioQueryResolvers;
