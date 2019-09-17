const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { APP_SECRET, getUserId } = require('../utils/auth')

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)
  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }
  const token = await jwt.sign({ userId: user.id }, APP_SECRET)
  return {
    token,
    user,
  }
}

function post(parent, { url, description }, context) {
  const userId = getUserId(context)
  return context.prisma.createLink({
    url,
    description,
    postedBy: { connect: { id: userId } },
  })
}

function updateLink(root, { id, url, description }, context) {
  return context.prisma.updateLink({
    data: { url, description },
    where: { id }
  })
}

function deleteLink(root, { id }, context) {
  return context.prisma.deleteLink({ id })
}

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
}
