const express = require('express')
const cors = require('cors')
const questionsRouter = require('./routes/questions')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const categoriesRouter = require('./routes/categories')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Questions API is running' })
})

app.use('/auth', authRouter)
app.use('/questions', questionsRouter)
app.use('/users', usersRouter)
app.use('/categories', categoriesRouter)

module.exports = app
