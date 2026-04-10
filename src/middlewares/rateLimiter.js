const { rateLimit } = require('express-rate-limit')

const rateLimiter = rateLimit({
  windowMs: 30 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Muitas requisições. Tente novamente em 30 segundos.',
  },
})

module.exports = rateLimiter
