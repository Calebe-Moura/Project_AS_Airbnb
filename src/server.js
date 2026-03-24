import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import  resolvers  from "./resolver/index.js";
import typeDefs from "./schema/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server).then(({ url }) => {
  console.log(`Server ready at: ${url}`);
})