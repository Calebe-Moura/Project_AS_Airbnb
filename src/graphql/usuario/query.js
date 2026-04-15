import usuarioService from "./service.js";

export const usuarioQueryResolvers = {
  usuarios: async () => {
    const usuarios = await usuarioService.findAllUsuarios();
    return usuarios;
  },

  usuario: async (_, { id }) => {
    return await usuarioService.findUsuarioById(id);
  },
};

export default usuarioQueryResolvers;
