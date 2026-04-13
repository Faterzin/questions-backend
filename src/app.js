const express = require('express')
const cors = require('cors')
const questionsRouter = require('./routes/questions')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Questions API is running' })
})

app.use('/questions', questionsRouter)

module.exports = app
