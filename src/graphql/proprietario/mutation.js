import proprietarioService from "./service.js";

export const proprietarioMutationResolvers = {
  createProprietario: async (_, { data }) => {
    return proprietarioService.createProprietario(data);
  },

  updateProprietario: async (_, { id, data }) => {
    return proprietarioService.updateProprietario(id, data);
  },

  deleteProprietario: async (_, { id }) => {
    return proprietarioService.deleteProprietario(id);
  },
};

export default proprietarioMutationResolvers;
