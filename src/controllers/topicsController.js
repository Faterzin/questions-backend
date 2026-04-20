const prisma = require('../lib/prisma')
const { slugify } = require('../lib/slug')

async function listTopics(req, res) {
  const { subjectId } = req.query

  const topics = await prisma.topic.findMany({
    where: subjectId ? { subjectId } : undefined,
    orderBy: [{ subject: { name: 'asc' } }, { name: 'asc' }],
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      _count: { select: { questions: true } },
    },
  })

  return res.json(topics)
}

async function createTopic(req, res) {
  const { name, subjectId } = req.body

  if (!name || !subjectId) {
    return res.status(400).json({ error: 'name e subjectId são obrigatórios' })
  }

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } })
  if (!subject) {
    return res.status(404).json({ error: 'Matéria não encontrada' })
  }

  const slug = slugify(name)

  const existing = await prisma.topic.findUnique({
    where: { subjectId_slug: { subjectId, slug } },
  })
  if (existing) {
    return res.status(409).json({ error: 'Assunto já existe nesta matéria' })
  }

  const topic = await prisma.topic.create({
    data: { name, slug, subjectId },
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      _count: { select: { questions: true } },
    },
  })

  return res.status(201).json(topic)
}

async function updateTopic(req, res) {
  const { id } = req.params
  const { name, subjectId } = req.body

  const data = {}
  if (name !== undefined) {
    data.name = name
    data.slug = slugify(name)
  }
  if (subjectId !== undefined) data.subjectId = subjectId

  const topic = await prisma.topic.update({
    where: { id },
    data,
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      _count: { select: { questions: true } },
    },
  })

  return res.json(topic)
}

async function deleteTopic(req, res) {
  const { id } = req.params

  const questionCount = await prisma.question.count({ where: { topicId: id } })
  if (questionCount > 0) {
    return res.status(400).json({
      error: `Não é possível deletar: ${questionCount} questões vinculadas`,
    })
  }

  await prisma.topic.delete({ where: { id } })
  return res.status(204).send()
}

module.exports = { listTopics, createTopic, updateTopic, deleteTopic }
