import UsuarioService from "./service.js";

export const UsuarioMutation = {
  createUsuario: async (_, { usuario }) => {
    return UsuarioService.createUsuario(usuario);
  },
};

export default UsuarioMutation;
