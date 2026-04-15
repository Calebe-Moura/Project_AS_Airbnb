import usuarioService from "./service.js";

export const usuarioMutationResolvers = {
  createUsuario: async (_, { input }) => {
    return usuarioService.createUsuario(input);
  },

  updateUsuario: async (_, { id, input }) => {
    return usuarioService.updateUsuario(id, input);
  },

  deleteUsuario: async (_, { id }) => {
    return usuarioService.deleteUsuario(id);
  },
};

export default usuarioMutationResolvers;
