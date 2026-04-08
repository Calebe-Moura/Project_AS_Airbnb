export function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371 // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distancia = R * c
  
  return Number(distancia.toFixed(2))
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

/**
 * Verifica se um ponto está dentro de um raio
 */
export function estaDentroDoRaio(lat1, lon1, lat2, lon2, raioKm) {
  const distancia = calcularDistancia(lat1, lon1, lat2, lon2)
  return distancia <= raioKm
}