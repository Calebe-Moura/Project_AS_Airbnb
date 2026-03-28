import usuarioService from './service.js';

export const usuarioQueryResolvers = {
  Query: {
    usuarios: async (_, { skip = 0, take = 10, filters = {} }) => {
      return usuarioService.findAllUsuarios(skip, take, filters);
    },
    
    usuario: async (_, { id }) => {
      return usuarioService.findUsuarioById(id);
    }
    
  }
};

export default usuarioQueryResolvers;