const { Router } = require('express')
const { listCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoriesController')
const { authMiddleware, requireAdmin } = require('../middlewares/auth')

const router = Router()

router.get('/', listCategories)
router.post('/', authMiddleware, requireAdmin, createCategory)
router.put('/:id', authMiddleware, requireAdmin, updateCategory)
router.delete('/:id', authMiddleware, requireAdmin, deleteCategory)

module.exports = router
