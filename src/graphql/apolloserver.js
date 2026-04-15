import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import cors from "cors";
import typeDefs from "./schema/index.js";
import resolvers from "./resolver/index.js";
import { expressMiddleware } from "@as-integrations/express5";

async function createServer() {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
    introspection: true,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json    (),
    expressMiddleware(server)
  );

  await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`Server ready at: http://localhost:4000/graphql`);
}

createServer().catch((error) => {
  console.error("Error starting server:", error);
});