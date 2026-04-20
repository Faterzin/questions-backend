const prisma = require('../lib/prisma')

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']
const VALID_STATUSES = ['pending', 'approved', 'rejected']

const QUESTION_INCLUDE = {
  topic: {
    select: {
      id: true,
      name: true,
      slug: true,
      subject: { select: { id: true, name: true, slug: true, color: true, icon: true } },
    },
  },
  reviewedBy: { select: { id: true, name: true, email: true } },
}

function parseSubjectFilter(subject) {
  return {
    topic: {
      subject: { OR: [{ slug: subject }, { name: { equals: subject, mode: 'insensitive' } }] },
    },
  }
}

function parseTopicFilter(topic) {
  return {
    topic: { OR: [{ slug: topic }, { name: { equals: topic, mode: 'insensitive' } }] },
  }
}

// GET /questions — público, só retorna approved
async function listQuestions(req, res) {
  const { subject, topic, difficulty, limit, page = 1 } = req.query

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
    ...(subject && parseSubjectFilter(subject)),
    ...(topic && parseTopicFilter(topic)),
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: QUESTION_INCLUDE,
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
  const {
    title,
    correctAnswer,
    incorrectAnswers,
    difficulty,
    topicId,
    submitterName,
    submitterEmail,
    source,
  } = req.body

  if (!title || !correctAnswer || !incorrectAnswers || !difficulty || !topicId) {
    return res.status(400).json({
      error: 'Campos obrigatórios: title, correctAnswer, incorrectAnswers, difficulty, topicId',
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

  const topic = await prisma.topic.findUnique({ where: { id: topicId } })
  if (!topic) {
    return res.status(404).json({ error: 'Assunto não encontrado' })
  }

  const question = await prisma.question.create({
    data: {
      title,
      correctAnswer,
      incorrectAnswers,
      difficulty,
      topicId,
      status: 'pending',
      submitterName: submitterName || null,
      submitterEmail: submitterEmail || null,
      source: source || null,
      submittedBy: req.user?.id || null,
    },
    include: QUESTION_INCLUDE,
  })

  return res.status(201).json(question)
}

// GET /questions/all — admin: lista com filtro de status
async function listAllQuestions(req, res) {
  const { subject, topic, difficulty, status, limit = 20, page = 1 } = req.query

  const take = parseInt(limit)
  const skip = (parseInt(page) - 1) * take

  const where = {
    ...(status && { status }),
    ...(difficulty && { difficulty }),
    ...(subject && parseSubjectFilter(subject)),
    ...(topic && parseTopicFilter(topic)),
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: QUESTION_INCLUDE,
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
  const { status, rejectReason } = req.body

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status deve ser "approved" ou "rejected"' })
  }

  if (status === 'rejected' && !rejectReason) {
    return res.status(400).json({ error: 'rejectReason é obrigatório ao rejeitar' })
  }

  const question = await prisma.question.update({
    where: { id },
    data: {
      status,
      rejectReason: status === 'rejected' ? rejectReason : null,
      reviewedById: req.user.id,
      reviewedAt: new Date(),
    },
    include: QUESTION_INCLUDE,
  })

  return res.json(question)
}

// PUT /questions/:id — admin: editar questão
async function updateQuestion(req, res) {
  const { id } = req.params
  const { title, correctAnswer, incorrectAnswers, difficulty, topicId, status, source } = req.body

  const data = {}
  if (title !== undefined) data.title = title
  if (correctAnswer !== undefined) data.correctAnswer = correctAnswer
  if (incorrectAnswers !== undefined) data.incorrectAnswers = incorrectAnswers
  if (topicId !== undefined) data.topicId = topicId
  if (source !== undefined) data.source = source || null

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status inválido. Use: ${VALID_STATUSES.join(', ')}` })
    }
    data.status = status
  }

  if (difficulty !== undefined) {
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ error: `Dificuldade inválida. Use: ${VALID_DIFFICULTIES.join(', ')}` })
    }
    data.difficulty = difficulty
  }

  const question = await prisma.question.update({
    where: { id },
    data,
    include: QUESTION_INCLUDE,
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
  const [pending, approved, rejected, total, bySubject] = await Promise.all([
    prisma.question.count({ where: { status: 'pending' } }),
    prisma.question.count({ where: { status: 'approved' } }),
    prisma.question.count({ where: { status: 'rejected' } }),
    prisma.question.count(),
    prisma.subject.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        topics: {
          select: { _count: { select: { questions: true } } },
        },
      },
    }),
  ])

  const subjectCounts = bySubject.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    total: s.topics.reduce((acc, t) => acc + t._count.questions, 0),
  }))

  return res.json({ pending, approved, rejected, total, bySubject: subjectCounts })
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
