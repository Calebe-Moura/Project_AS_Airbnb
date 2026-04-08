import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROTO_PATH = path.join(__dirname, '../grpc/lugar.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const lugaresProto = grpc.loadPackageDefinition(packageDefinition).lugares

class LugarClient {
  constructor() {
    this.client = new lugaresProto.LugaresService(
      process.env.LUGARES_SERVICE_URL || 'localhost:50052',
      grpc.credentials.createInsecure()
    )
  }
  
  async buscarLugaresProximos(latitude, longitude, raioKm, tipo, limite = 10) {
    return new Promise((resolve, reject) => {
      this.client.buscarLugaresProximos({
        latitude,
        longitude,
        raio_km: raioKm,
        tipo,
        limite
      }, (error, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
  
  async buscarPorCategoria(cidade, categoria, limite = 10) {
    return new Promise((resolve, reject) => {
      this.client.buscarPorCategoria({
        cidade,
        categoria,
        limite
      }, (error, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
}

export default new LugarClient()