import { QueryResolver } from "./queryResolver.js";
//import { MutationResolver } from "./mutationResolver.js";

export const resolvers = {
    ...QueryResolver,

 /* Mutation:{
  ...MutationResolver,
}
*/
};

export default resolvers;
