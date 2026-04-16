const prisma = require('../lib/prisma')

async function listCategories(req, res) {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { questions: true } } },
  })

  return res.json(categories)
}

async function createCategory(req, res) {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ error: 'name é obrigatório' })
  }

  const existing = await prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  })

  if (existing) {
    return res.status(409).json({ error: 'Categoria já existe' })
  }

  const category = await prisma.category.create({
    data: { name },
    include: { _count: { select: { questions: true } } },
  })

  return res.status(201).json(category)
}

async function updateCategory(req, res) {
  const { id } = req.params
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ error: 'name é obrigatório' })
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name },
    include: { _count: { select: { questions: true } } },
  })

  return res.json(category)
}

async function deleteCategory(req, res) {
  const { id } = req.params

  const count = await prisma.question.count({ where: { categoryId: id } })
  if (count > 0) {
    return res.status(400).json({ error: `Não é possível deletar: ${count} questões vinculadas` })
  }

  await prisma.category.delete({ where: { id } })
  return res.status(204).send()
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory }
