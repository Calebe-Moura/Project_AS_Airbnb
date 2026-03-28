import UsuarioQuery from "../usuario/query.js";
import EnderecoQuery from "../endereco/query.js";
import ProrietarioQuery from "../proprietario/query.js"
import PagamentoQuery from "../pagamento/query.js"
import AvaliacaoQuery from "../avaliacao/query.js"
import AluguelQuery from "../aluguel/query.js"

export const QueryResolver = {
    ...UsuarioQuery,
    ...EnderecoQuery,
    ...AluguelQuery,
    ...AvaliacaoQuery,
    ...PagamentoQuery,
    ...ProrietarioQuery
}

export default QueryResolver
