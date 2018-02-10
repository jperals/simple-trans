const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const jsonfile = require('jsonfile')
const mosca = require('mosca')
const mqtt = require('mqtt')
const l10nPath = 'static/l10n'

const config = {
  BACKEND_URL: 'localhost',
  BACKEND_PORT: 5000
}

var app = express()

app.use(cors())
app.use(bodyParser.json())

app.use(express.static('dist'))
app.use('/static', express.static('static'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(config.BACKEND_PORT, function () {
  console.log('Server listening on port', config.BACKEND_PORT)
})

function translate ({ languageId, msgid, translation }) {
  return new Promise(function(resolve, reject) {
    const filePath = [l10nPath, languageId + '.json'].join('/')
    jsonfile.readFile(filePath, function(err, obj) {
      if(err) {
        reject(err)
      }
      else {
        obj[msgid] = translation
        jsonfile.writeFile(filePath, obj, { spaces: 4 }, function(err) {
          if(err) {
            reject(err)
          }
          else {
            resolve()
          }
        })
      }
    })
  })
}

app.put('/translate', function(req, res) {
  const languageId = req.body.languageId
  const msgid = req.body.msgid
  const translation = req.body.translation
  translate({ languageId, msgid, translation })
    .then(function () {
      console.log('File written')
      mqttClient.publish('set', JSON.stringify({ languageId, msgid, translation }))
      res.send('ok')
    })
    .catch(function (err) {
      console.error(err)
      mqttClient.publish('error', err)
      res.status(500)
      res.send({ error: err })
    })
})

app.get('/languages', function(req, res) {
  fs.readdir(l10nPath, function(err, files) {
    if(err) {
      throw(err);
    }
    let languages = []
    for(let file of files) {
      if(fs.statSync([l10nPath, file].join('/')).isFile()) {
        let split =  file.split('.')
        if(split && split.length && split[1] === 'json') {
          languages.push(split[0])
        }
      }
    }
    res.json(languages)
  })
})

app.get('/translations/until', function(req, res) {
  const languageId = req.body.language
  const filePath = [l10nPath, languageId + '.json'].join('/')
  const until = req.body.until
  jsonfile.readFile(filePath, function (err, obj) {
    if(err) {
      console.error(err)
      res.status(500)
      res.send({ error: err })
    }
    else {

    }
  })
})

const broker = new mosca.Server({
  "port": config.MQTT_PORT || 1883,
  "http": {
    "url": config.MQTT_HTTP_URL || "ws://localhost",
    "port": config.MQTT_HTTP_PORT || 9000,
    "bundle": true,
    "static": "./"
  }
})

broker.on('ready', function () {
  console.log('Mosca server is up and running')
})
broker.on('clientConnected', function(client) {
  console.log('Client connected', client.id)
})
// Fired when a message is received
broker.on('published', function(packet, client) {
  let payload = packet.payload;
  try {
      payload = payload.toString()
  } catch (e) {
      // Not a string, no problem
      try {
          payload = JSON.parse(payload)
      } catch (e) {
          // Not a JSON object, no problem
      }
  }
  console.log('Published message:', payload)
})

const mqttHttpPort = config.MQTT_HTTP_PORT || 9000
const mqttUrl = (config.MQTT_HTTP_URL || 'ws://localhost') + ':' + mqttHttpPort
const mqttClient = mqtt.connect(mqttUrl)

mqttClient.on('connect', function () {
  mqttClient.subscribe('presence')
  mqttClient.publish('presence', 'MQTT API connected')
})

mqttClient.on('error', (error)=>{
  console.error('MQTT', error)
})

mqttClient.on('message', function (topic, message) {
  let data = message.toString()
  try {
    data = JSON.parse(data)
  }
  catch (e) {
    // Not a JSON object
  }
  switch (data) {
    case 'set':
      translate(data)
      break;
  }
})
