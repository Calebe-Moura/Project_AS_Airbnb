import UsuarioRepository  from "../usuario/repository.js";

export function createUsuario (usuario) {
    return UsuarioRepository.create(usuario);
}

export function getAllUsuarios() {
    return UsuarioRepository.findAll();
}

export function getUsuarioById(id) {
    return UsuarioRepository.findById(id);
}

const UsuarioService = {
    createUsuario,
    getAllUsuarios,
    getUsuarioById,
}
export default UsuarioService
