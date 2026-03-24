import UsuarioService from "./service.js";

export const UsuarioQuery = {
  usuarios: async () => {
    return UsuarioService.getAllUsuarios();
  },

  usuario: async (_, { id }) => {
    return UsuarioService.getUsuarioById(id);
  },
};

export default UsuarioQuery;
