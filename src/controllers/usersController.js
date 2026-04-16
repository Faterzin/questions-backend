const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')

async function listUsers(req, res) {
  const { page = 1, limit = 20, search } = req.query

  const take = parseInt(limit)
  const skip = (parseInt(page) - 1) * take

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    }),
    prisma.user.count({ where }),
  ])

  return res.json({
    total,
    page: parseInt(page),
    limit: take,
    pages: Math.ceil(total / take),
    data: users,
  })
}

async function createUser(req, res) {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password são obrigatórios' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ error: 'Email já cadastrado' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'admin' },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })

  return res.status(201).json(user)
}

async function updateUser(req, res) {
  const { id } = req.params
  const { name, email, password, role, active } = req.body

  const data = {}
  if (name !== undefined) data.name = name
  if (email !== undefined) data.email = email
  if (role !== undefined) data.role = role
  if (active !== undefined) data.active = active
  if (password) data.password = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })

  return res.json(user)
}

async function deleteUser(req, res) {
  const { id } = req.params

  if (id === req.user.id) {
    return res.status(400).json({ error: 'Você não pode deletar sua própria conta' })
  }

  await prisma.user.delete({ where: { id } })
  return res.status(204).send()
}

module.exports = { listUsers, createUser, updateUser, deleteUser }
