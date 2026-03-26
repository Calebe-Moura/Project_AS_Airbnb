import proprietarioService from './service.js';

export const proprietarioQueryResolvers = {
    Query: {
        proprietarios: async (_, { skip = 0, take = 10, filters = {} }) => {
            return proprietarioService.findAllProprietarios(skip, take, filters);
        },

        proprietario: async (_, { id }) => {
            return proprietarioService.findProprietarioById(id);
        }
    }
};

export default proprietarioQueryResolvers;