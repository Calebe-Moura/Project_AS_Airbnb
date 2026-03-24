import EnderecoService from "./service.js";

export const EnderecoQuery = {
  enderecos: async () => {
    return EnderecoService.getAllEnderecos();
  },

  endereco: async (_, { id }) => {
    return EnderecoService.getEnderecoById(id);
  },
};

export default EnderecoQuery;
