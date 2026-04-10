const { rateLimit } = require('express-rate-limit')

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Muitas requisições. Tente novamente em 1 minuto.',
  },
})

module.exports = rateLimiter
