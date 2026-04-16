const { Router } = require('express')
const {
  listQuestions,
  createQuestion,
  listAllQuestions,
  reviewQuestion,
  updateQuestion,
  deleteQuestion,
  getStats,
} = require('../controllers/questionsController')
const rateLimiter = require('../middlewares/rateLimiter')
const base64Response = require('../middlewares/base64Response')
const { authMiddleware, requireAdmin } = require('../middlewares/auth')

const router = Router()

// Públicas
router.get('/', rateLimiter, base64Response, listQuestions)
router.post('/', rateLimiter, createQuestion)

// Admin
router.get('/all', authMiddleware, requireAdmin, listAllQuestions)
router.get('/stats', authMiddleware, requireAdmin, getStats)
router.patch('/:id/review', authMiddleware, requireAdmin, reviewQuestion)
router.put('/:id', authMiddleware, requireAdmin, updateQuestion)
router.delete('/:id', authMiddleware, requireAdmin, deleteQuestion)

module.exports = router
