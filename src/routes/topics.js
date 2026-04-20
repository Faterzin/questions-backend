const { Router } = require('express')
const {
  listTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicsController')
const { authMiddleware, requireAdmin } = require('../middlewares/auth')

const router = Router()

router.get('/', listTopics)
router.post('/', authMiddleware, requireAdmin, createTopic)
router.put('/:id', authMiddleware, requireAdmin, updateTopic)
router.delete('/:id', authMiddleware, requireAdmin, deleteTopic)

module.exports = router
