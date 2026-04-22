const prisma = require('../lib/prisma')
const { slugify } = require('../lib/slug')

const APPROVED_TOPIC_WHERE = { status: 'approved' }

async function listSubjects(req, res) {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { topics: { where: APPROVED_TOPIC_WHERE } } },
      topics: {
        where: APPROVED_TOPIC_WHERE,
        orderBy: { name: 'asc' },
        include: { _count: { select: { questions: true } } },
      },
    },
  })

  return res.json(subjects)
}

async function getSubject(req, res) {
  const { id } = req.params

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      topics: {
        where: APPROVED_TOPIC_WHERE,
        orderBy: { name: 'asc' },
        include: { _count: { select: { questions: true } } },
      },
    },
  })

  if (!subject) {
    return res.status(404).json({ error: 'Matéria não encontrada' })
  }

  return res.json(subject)
}

async function createSubject(req, res) {
  const { name, color, icon } = req.body

  if (!name) {
    return res.status(400).json({ error: 'name é obrigatório' })
  }

  const slug = slugify(name)

  const existing = await prisma.subject.findFirst({
    where: { OR: [{ name: { equals: name, mode: 'insensitive' } }, { slug }] },
  })

  if (existing) {
    return res.status(409).json({ error: 'Matéria já existe' })
  }

  const subject = await prisma.subject.create({
    data: { name, slug, color: color || null, icon: icon || null },
    include: { _count: { select: { topics: true } } },
  })

  return res.status(201).json(subject)
}

async function updateSubject(req, res) {
  const { id } = req.params
  const { name, color, icon } = req.body

  const data = {}
  if (name !== undefined) {
    data.name = name
    data.slug = slugify(name)
  }
  if (color !== undefined) data.color = color
  if (icon !== undefined) data.icon = icon

  const subject = await prisma.subject.update({
    where: { id },
    data,
    include: { _count: { select: { topics: true } } },
  })

  return res.json(subject)
}

async function deleteSubject(req, res) {
  const { id } = req.params

  const topicCount = await prisma.topic.count({ where: { subjectId: id } })
  if (topicCount > 0) {
    return res.status(400).json({
      error: `Não é possível deletar: ${topicCount} assuntos vinculados`,
    })
  }

  await prisma.subject.delete({ where: { id } })
  return res.status(204).send()
}

module.exports = {
  listSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
}
