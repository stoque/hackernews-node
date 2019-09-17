const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => null,

    feed: (root, args, context) => context.prisma.links(),
  },
  Mutation: {
    post: (_, { url, description }, context) => {
      return context.prisma.createLink({ url, description })
    },

    updateLink: (_, { id, url, description }, context) => {
      return context.prisma.updateLink({ id, url, description })
    },

    deleteLink: (parent, { id }) => {
      const removedLink = links.find((link) => link.id === id);
      links = links.filter((link) => link.id !== id)
      return removedLink
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})

server.start(() => console.log('Server is running on http://localhost:4000'))
