const express = require('express')
const app = express()

const championsRouter = require('./controllers/champions')
const connectRouter = require('./controllers/connect')
const middleware = require('./utils/middleware')


app.use(express.json())

app.use('/', connectRouter)
app.use('/api/champions', championsRouter)

app.use(middleware.errorHandler)

module.exports = app