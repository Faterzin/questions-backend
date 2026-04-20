const { Router } = require('express')
const {
  listSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectsController')
const { authMiddleware, requireAdmin } = require('../middlewares/auth')

const router = Router()

router.get('/', listSubjects)
router.get('/:id', getSubject)
router.post('/', authMiddleware, requireAdmin, createSubject)
router.put('/:id', authMiddleware, requireAdmin, updateSubject)
router.delete('/:id', authMiddleware, requireAdmin, deleteSubject)

module.exports = router
