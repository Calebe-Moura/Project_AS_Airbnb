import UsuarioQuery from "../usuario/query.js";
import EnderecoQuery from "../endereco/query.js";

export const QueryResolver = {
    ...UsuarioQuery,
    ...EnderecoQuery
}

export default QueryResolver
