import enderecoService from "./service.js";

export const enderecoMutationResolvers = {
  createEndereco: async (
    _,
    {
      rua,
      numero,
      complemento,
      cidade,
      estado,
      pais,
      cep,
      latitude,
      longitude,
      usuarioId,
      proprietarioId,
    },
  ) => {
    return enderecoService.createEndereco(input);
  },
  updateEndereco: async (
    _,
    {
      id,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      pais,
      cep,
      latitude,
      longitude,
      usuarioId,
      proprietarioId,
    },
  ) => {
    return enderecoService.updateEndereco(id, input);
  },
  deleteEndereco: async (_, { id }) => {
    return enderecoService.deleteEndereco(id);
  },
};

export default enderecoMutationResolvers;
