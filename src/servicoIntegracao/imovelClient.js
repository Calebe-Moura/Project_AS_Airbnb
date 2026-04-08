import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROTO_PATH = path.join(__dirname, '../grpc/imovel.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const imoveisProto = grpc.loadPackageDefinition(packageDefinition).imoveis

class ImoveisClient {
  constructor() {
    this.client = new imoveisProto.ImoveisService(
      process.env.IMOVEIS_SERVICE_URL || 'localhost:50051',
      grpc.credentials.createInsecure()
    )
  }
  
  async buscarImoveisProximos(latitude, longitude, raioKm) {
    return new Promise((resolve, reject) => {
      this.client.buscarImoveisProximos({
        latitude,
        longitude,
        raio_km: raioKm
      }, (error, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
  
  async buscarImovelPorId(id) {
    return new Promise((resolve, reject) => {
      this.client.buscarImovelPorId({ id }, (error, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
}

export default new ImoveisClient()