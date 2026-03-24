import UsuarioMutation from "../usuario/mutation.js";
import EnderecoMutation from "../endereco/mutation.js";

export const MutationResolver = {
    ...UsuarioMutation,
    ...EnderecoMutation
}