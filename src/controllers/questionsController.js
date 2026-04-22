const prisma = require('../lib/prisma')
const { slugify } = require('../lib/slug')

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']
const VALID_STATUSES = ['pending', 'approved', 'rejected']
const INCORRECT_ANSWERS_COUNT = 4

function validateIncorrectAnswers(incorrectAnswers, correctAnswer) {
  if (!Array.isArray(incorrectAnswers)) {
    return 'incorrectAnswers deve ser um array'
  }
  if (incorrectAnswers.length !== INCORRECT_ANSWERS_COUNT) {
    return `incorrectAnswers deve conter exatamente ${INCORRECT_ANSWERS_COUNT} alternativas erradas (1 correta + ${INCORRECT_ANSWERS_COUNT} erradas = 5 opções)`
  }
  if (incorrectAnswers.some((a) => typeof a !== 'string' || !a.trim())) {
    return `Todas as ${INCORRECT_ANSWERS_COUNT} alternativas incorretas devem ser strings não vazias`
  }
  const trimmed = incorrectAnswers.map((a) => a.trim())
  if (new Set(trimmed).size !== INCORRECT_ANSWERS_COUNT) {
    return 'As alternativas incorretas devem ser distintas entre si'
  }
  if (typeof correctAnswer === 'string' && trimmed.includes(correctAnswer.trim())) {
    return 'A resposta correta não pode ser igual a uma das alternativas incorretas'
  }
  return null
}

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
    subjectId,
    topicName,
    submitterName,
    submitterEmail,
    source,
  } = req.body

  if (!title || !correctAnswer || !incorrectAnswers || !difficulty) {
    return res.status(400).json({
      error: 'Campos obrigatórios: title, correctAnswer, incorrectAnswers, difficulty',
    })
  }

  const hasTopicId = typeof topicId === 'string' && topicId.trim()
  const hasNewTopic =
    typeof subjectId === 'string' && subjectId.trim() &&
    typeof topicName === 'string' && topicName.trim()

  if (!hasTopicId && !hasNewTopic) {
    return res.status(400).json({
      error: 'Informe topicId (assunto existente) ou subjectId + topicName (novo assunto)',
    })
  }

  const incorrectAnswersError = validateIncorrectAnswers(incorrectAnswers, correctAnswer)
  if (incorrectAnswersError) {
    return res.status(400).json({ error: incorrectAnswersError })
  }

  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      error: `Dificuldade inválida. Use: ${VALID_DIFFICULTIES.join(', ')}`,
    })
  }

  let resolvedTopicId = hasTopicId ? topicId : null

  if (hasTopicId) {
    const topic = await prisma.topic.findUnique({ where: { id: topicId } })
    if (!topic) {
      return res.status(404).json({ error: 'Assunto não encontrado' })
    }
  } else {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } })
    if (!subject) {
      return res.status(404).json({ error: 'Matéria não encontrada' })
    }

    const trimmedName = topicName.trim()
    const slug = slugify(trimmedName)
    if (!slug) {
      return res.status(400).json({ error: 'topicName inválido' })
    }

    const existing = await prisma.topic.findUnique({
      where: { subjectId_slug: { subjectId, slug } },
    })
    if (existing) {
      resolvedTopicId = existing.id
    } else {
      const created = await prisma.topic.create({
        data: { name: trimmedName, slug, subjectId, status: 'pending' },
      })
      resolvedTopicId = created.id
    }
  }

  const question = await prisma.question.create({
    data: {
      title: title.trim(),
      correctAnswer: correctAnswer.trim(),
      incorrectAnswers: incorrectAnswers.map((a) => a.trim()),
      difficulty,
      topicId: resolvedTopicId,
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

  if (status === 'approved' && question.topic && question.topic.subject) {
    await prisma.topic.updateMany({
      where: { id: question.topicId, status: 'pending' },
      data: { status: 'approved' },
    })
  }

  return res.json(question)
}

// PUT /questions/:id — admin: editar questão
async function updateQuestion(req, res) {
  const { id } = req.params
  const { title, correctAnswer, incorrectAnswers, difficulty, topicId, status, source } = req.body

  const data = {}
  if (title !== undefined) data.title = typeof title === 'string' ? title.trim() : title
  if (correctAnswer !== undefined) {
    data.correctAnswer = typeof correctAnswer === 'string' ? correctAnswer.trim() : correctAnswer
  }
  if (topicId !== undefined) data.topicId = topicId
  if (source !== undefined) data.source = source || null

  if (incorrectAnswers !== undefined) {
    let referenceCorrect = data.correctAnswer
    if (referenceCorrect === undefined) {
      const existing = await prisma.question.findUnique({
        where: { id },
        select: { correctAnswer: true },
      })
      if (!existing) return res.status(404).json({ error: 'Questão não encontrada' })
      referenceCorrect = existing.correctAnswer
    }
    const incorrectAnswersError = validateIncorrectAnswers(incorrectAnswers, referenceCorrect)
    if (incorrectAnswersError) {
      return res.status(400).json({ error: incorrectAnswersError })
    }
    data.incorrectAnswers = incorrectAnswers.map((a) => a.trim())
  }

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
