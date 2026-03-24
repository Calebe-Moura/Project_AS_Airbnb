import EnderecoService from "./service.js";

export const EnderecoMutation = {
  createEndereco: async (_, { endereco }) => {
    return EnderecoService.createEndereco(endereco);
  },
};

export default EnderecoMutation;
