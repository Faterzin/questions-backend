const prisma = require('../lib/prisma')

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']

// GET /questions — público, só retorna approved
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
    status: 'approved',
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

// POST /questions — público, cria como pending
async function createQuestion(req, res) {
  const { title, correctAnswer, incorrectAnswers, difficulty, categoryId, categoryName, submittedBy } = req.body

  if (!title || !correctAnswer || !incorrectAnswers || !difficulty) {
    return res.status(400).json({
      error: 'Campos obrigatórios: title, correctAnswer, incorrectAnswers, difficulty',
    })
  }

  if (!Array.isArray(incorrectAnswers) || incorrectAnswers.length === 0) {
    return res.status(400).json({ error: 'incorrectAnswers deve ser um array com pelo menos 1 item' })
  }

  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      error: `Dificuldade inválida. Use: ${VALID_DIFFICULTIES.join(', ')}`,
    })
  }

  let resolvedCategoryId = categoryId

  if (!resolvedCategoryId && categoryName) {
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } },
    })

    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } })
    }

    resolvedCategoryId = category.id
  }

  if (!resolvedCategoryId) {
    return res.status(400).json({ error: 'categoryId ou categoryName é obrigatório' })
  }

  const question = await prisma.question.create({
    data: {
      title,
      correctAnswer,
      incorrectAnswers,
      difficulty,
      categoryId: resolvedCategoryId,
      status: 'pending',
      submittedBy: submittedBy || null,
    },
    include: { category: { select: { id: true, name: true } } },
  })

  return res.status(201).json(question)
}

// GET /questions/all — admin: lista com filtro de status
async function listAllQuestions(req, res) {
  const { category, difficulty, status, limit = 20, page = 1 } = req.query

  const take = parseInt(limit)
  const skip = (parseInt(page) - 1) * take

  const where = {
    ...(status && { status }),
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
      take,
      skip,
    }),
    prisma.question.count({ where }),
  ])

  return res.json({
    total,
    page: parseInt(page),
    limit: take,
    pages: Math.ceil(total / take),
    data: questions,
  })
}

// PATCH /questions/:id/review — admin: aprovar ou rejeitar
async function reviewQuestion(req, res) {
  const { id } = req.params
  const { status } = req.body

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status deve ser "approved" ou "rejected"' })
  }

  const question = await prisma.question.update({
    where: { id },
    data: { status },
    include: { category: { select: { id: true, name: true } } },
  })

  return res.json(question)
}

// PUT /questions/:id — admin: editar questão
async function updateQuestion(req, res) {
  const { id } = req.params
  const { title, correctAnswer, incorrectAnswers, difficulty, categoryId, categoryName, status } = req.body

  const data = {}
  if (title !== undefined) data.title = title
  if (correctAnswer !== undefined) data.correctAnswer = correctAnswer
  if (incorrectAnswers !== undefined) data.incorrectAnswers = incorrectAnswers
  if (status !== undefined) data.status = status
  if (difficulty !== undefined) {
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ error: `Dificuldade inválida. Use: ${VALID_DIFFICULTIES.join(', ')}` })
    }
    data.difficulty = difficulty
  }

  if (categoryId) {
    data.categoryId = categoryId
  } else if (categoryName) {
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } },
    })
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } })
    }
    data.categoryId = category.id
  }

  const question = await prisma.question.update({
    where: { id },
    data,
    include: { category: { select: { id: true, name: true } } },
  })

  return res.json(question)
}

// DELETE /questions/:id — admin
async function deleteQuestion(req, res) {
  const { id } = req.params
  await prisma.question.delete({ where: { id } })
  return res.status(204).send()
}

// GET /questions/stats — admin: contagem por status
async function getStats(req, res) {
  const [pending, approved, rejected, total] = await Promise.all([
    prisma.question.count({ where: { status: 'pending' } }),
    prisma.question.count({ where: { status: 'approved' } }),
    prisma.question.count({ where: { status: 'rejected' } }),
    prisma.question.count(),
  ])

  return res.json({ pending, approved, rejected, total })
}

module.exports = {
  listQuestions,
  createQuestion,
  listAllQuestions,
  reviewQuestion,
  updateQuestion,
  deleteQuestion,
  getStats,
}
