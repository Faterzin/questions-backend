const { Router } = require('express')
const { listUsers, createUser, updateUser, deleteUser } = require('../controllers/usersController')
const { authMiddleware, requireAdmin } = require('../middlewares/auth')

const router = Router()

router.use(authMiddleware, requireAdmin)

router.get('/', listUsers)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
