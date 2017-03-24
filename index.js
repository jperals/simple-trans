const express = require('express')
const bodyParser = require('body-parser')
const jsonfile = require('jsonfile')
const l10nPath = 'static/l10n'

console.log(process.env.NODE_ENV)

var app = express()

app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Server listening on port 3000!')
})

app.put('/translate', function(req, res) {
  const languageId = req.body.language
  const msgid = req.body.msgid
  const translation = req.body.translation
  const filePath = [l10nPath, languageId + '.json'].join('/')
  jsonfile.readFile(filePath, function(err, obj) {
    if(err) {
      console.error(err)
      res.status(500)
      res.send({ error: err })
    }
    else {
      obj[msgid] = translation
      jsonfile.writeFile(filePath, obj, { spaces: 4 }, function(err) {
        if(err) {
          console.error(err)
          res.status(500)
          res.send({ error: err })
        }
        else {
          console.log('File written')
          res.send('ok')
        }
      })
    }

  })
})
