const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',

    feed: (root, args, context) => context.prisma.links(),
  },
  Mutation: {
    post: (root, { url, description }, context) => {
      return context.prisma.createLink({ url, description })
    },

    updateLink: (root, { id, url, description }, context) => {
      return context.prisma.updateLink({
        data: { url, description },
        where: { id }
      })
    },

    deleteLink: (root, { id }, context) => {
      return context.prisma.deleteLink({ id })
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})

server.start(() => console.log('Server is running on http://localhost:4000'))
