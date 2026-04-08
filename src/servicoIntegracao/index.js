// Adicionar no início
import ImoveisGrpcClient from './imovelClient.js'
import LugaresGrpcClient from './lugarClient.js'

imoveisProximos: async (_, { latitude, longitude, raioKm }) => {
  const response = await ImoveisGrpcClient.buscarImoveisProximos(latitude, longitude, raioKm)
  return {
    imoveis: response.imoveis,
    totalEncontrados: response.total_encontrados
  }
};
lugaresProximos: async (_, { latitude, longitude, raioKm, tipo, limite = 10 }) => {
  const response = await LugaresGrpcClient.buscarLugaresProximos(latitude, longitude, raioKm, tipo, limite)
  return {
    lugares: response.lugares,
    totalEncontrados: response.total_encontrados,
    fonteDados: response.fonte_dados
  }
};
lugaresPorCategoria: async (_, { cidade, categoria, limite = 10 }) => {
  const response = await LugaresGrpcClient.buscarPorCategoria(cidade, categoria, limite)
  return {
    lugares: response.lugares,
    totalEncontrados: response.total_encontrados,
    fonteDados: response.fonte_dados
  }
}