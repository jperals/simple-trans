const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const config = require('./config')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use(express.static('dist'))
app.use('/static', express.static('static'))

app.listen(config.BACKEND_PORT, function () {
  console.log('Server listening on port', config.BACKEND_PORT)
})

module.exports = app
