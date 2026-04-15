import usuarioQueryResolvers from "../usuario/query.js";
import prorietarioQueryResolvers from "../proprietario/query.js";
import enderecoQueryResolvers from "../endereco/query.js";
//import pagamentoQueryResolvers from "../pagamento/query.js"
//import avaliacaoQueryResolvers from "../avaliacao/query.js"
import aluguelQueryResolvers from "../aluguel/query.js"
export const QueryResolver = {
    ...prorietarioQueryResolvers,
    ...usuarioQueryResolvers,
    ...enderecoQueryResolvers,
    ...aluguelQueryResolvers,
}

export default QueryResolver;
