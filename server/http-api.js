const app = require('./app')
const mqttClient = require('./mqtt-client')
const translate = require('./translate')

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

