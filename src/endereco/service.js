import EnderecoRepository  from "../usuario/repository.js";

export function createEndereco (endereco) {
    return EnderecoRepository.create(endereco);
}

export function getAllEnderecos() {
    return EnderecoRepository.findAll();
}

export function getEnderecoById(id) {
    return EnderecoRepository.findById(id);
}

const EnderecoService = {
    createEndereco,
    getAllEnderecos,
    getEnderecoById,
}

export default EnderecoService
