const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')
const { JWT_SECRET } = require('../middlewares/auth')

const TOKEN_EXPIRATION = '7d'

async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  if (!user.active) {
    return res.status(403).json({ error: 'Conta desativada' })
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  )

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}

async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }

  return res.json(user)
}

module.exports = { login, me }
