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

const submitRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Muitas submissões. Aguarde 1 minuto antes de enviar outra questão.',
  },
})

module.exports = rateLimiter
module.exports.submitRateLimiter = submitRateLimiter
