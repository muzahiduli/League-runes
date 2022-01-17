const express = require('express')
const app = express()
const cors = require('cors')
const championsRouter = require('./controllers/champions')
const connectRouter = require('./controllers/connect')
const middleware = require('./utils/middleware')



app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use('/league', connectRouter)
app.use('/api', championsRouter)

//app.use(middleware.errorHandler)

module.exports = app