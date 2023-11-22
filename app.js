const express = require('express')
const mongoose = require("mongoose")
const {StatusCodes} = require('http-status-codes')
const bodyParser = require('body-parser');

const {PORT = 3000} = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('MongoDB connected'))

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next) => {
  req.user = {_id: '655d37121c3f3309bbd83a5d'}
  next()
})

app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))
app.use('*', (req, res) => res.status(StatusCodes.NOT_FOUND).send({ message: 'Несуществующий эндпоинт' }))

app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`)
})
