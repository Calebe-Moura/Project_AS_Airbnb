import enderecoService from "./service.js";

export const enderecoQueryResolvers = {
  enderecos: async () => {
    return enderecoService.findAllEnderecos();
  },

  endereco: async (_, { id }) => {
    return enderecoService.findEnderecoById(id);
  },
};

export default enderecoQueryResolvers;
