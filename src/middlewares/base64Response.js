function encodeValues(value) {
  if (value === null || value === undefined) return value
  if (Array.isArray(value)) return value.map(encodeValues)
  if (typeof value === 'object') {
    const result = {}
    for (const [k, v] of Object.entries(value)) {
      result[k] = encodeValues(v)
    }
    return result
  }
  return Buffer.from(String(value)).toString('base64')
}

function base64Response(req, res, next) {
  const { encode } = req.query
  delete req.query.encode

  if (encode !== 'base64') return next()

  const originalJson = res.json.bind(res)

  res.json = (data) => {
    originalJson(encodeValues(data))
  }

  next()
}

module.exports = base64Response
