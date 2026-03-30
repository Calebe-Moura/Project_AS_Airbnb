import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import ImovelImplementation from './implementation';
import serviceImovel from './service.js';
import ImovelDatasource from './datasource.js';

const datasource = new ImovelDatasource();
const service = new serviceImovel(datasource);
const implementation = new ImovelImplementation(service);
const imovelPackage = grpc.loadPackageDefinition(packageDefinition).imovelPackage;
const PROTO_PATH = path.join(process.cwd(), 'src', 'grpc', 'imovel.proto');

server.addServer(imovelPackage.ImovelService.service, implementation);

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`🚀 Server running at http://127.0.0.1:${port}`);
});