const prisma = require('../lib/prisma')

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']

async function listQuestions(req, res) {
  const { category, difficulty, limit, page = 1 } = req.query

  if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      error: `Dificuldade inválida. Use: ${VALID_DIFFICULTIES.join(', ')}`,
    })
  }

  const take = limit ? parseInt(limit) : undefined
  const skip = take ? (parseInt(page) - 1) * take : undefined

  const where = {
    ...(difficulty && { difficulty }),
    ...(category && {
      category: { name: { equals: category, mode: 'insensitive' } },
    }),
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: { select: { id: true, name: true } } },
      ...(take && { take }),
      ...(skip && { skip }),
    }),
    prisma.question.count({ where }),
  ])

  return res.json({
    total,
    page: parseInt(page),
    ...(take && { limit: take, pages: Math.ceil(total / take) }),
    data: questions,
  })
}

module.exports = { listQuestions }
