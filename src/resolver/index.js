import { QueryResolver } from "./queryResolver.js";
import { MutationResolver } from "./mutationResolver.js";

export const resolvers = {
  Query: {
    ...QueryResolver,
  },

  Mutation:{
  ...MutationResolver,
}
};

export default resolvers;
