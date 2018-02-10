const app = require('./app')
const fs = require('fs')
const jsonfile = require('jsonfile')
const mqttClient = require('./mqtt-client')

const getLanguages = require('./get-languages')
const searchFilter = require('./search-filter')
const translate = require('./translate')

const l10nPath = require('./config').l10nPath

app.put('/translate', function (req, res) {
  const languageId = req.body.languageId
  const msgid = req.body.msgid
  const translation = req.body.translation
  translate({languageId, msgid, translation})
    .then(function () {
      console.log('File written')
      mqttClient.publish('set', JSON.stringify({languageId, msgid, translation}))
      res.send('ok')
    })
    .catch(function (err) {
      console.error(err)
      mqttClient.publish('error', err)
      res.status(500)
      res.send({error: err})
    })
})

app.get('/languages', function (req, res) {
  getLanguages()
    .then(function (languages) {
      res.json(languages)
    })
    .catch(function (err) {
      res.status(500)
      res.send({error: err})
    })
})

app.get('/translations', function (req, res) {
  const languageId = req.query.languageId
  const searchQuery = req.query.searchQuery
  if (languageId) {
    const filePath = [l10nPath, languageId + '.json'].join('/')
    jsonfile.readFile(filePath, function (err, obj) {
      if (err) {
        console.error(err)
        res.status(500)
        res.send({error: err})
      }
      else {
        res.send(obj)
      }
    })
  } else {
    getLanguages()
      .then(function (languages) {
        let translations = {}
        const promises = []
        for (const languageId of languages) {
          promises.push(new Promise(function (resolve, reject) {
            const filePath = [l10nPath, languageId + '.json'].join('/')
            jsonfile.readFile(filePath, function (err, obj) {
              if (err) {
                reject(err)
              } else {
                translations[languageId] = obj
                resolve(obj)
              }
            })
          }))
        }
        Promise.all(promises)
          .then(function () {
            if (searchQuery) {
              translations = searchFilter(translations, JSON.parse(searchQuery))
            }
            res.send(translations)
          })
          .catch(function (err) {
            console.error(err)
            res.status(500)
            res.send({error: err})
          })
      })
      .catch(function (err) {
        console.error(err)
        res.status(500)
        res.send({error: err})
      })
  }
})

app.get('/translations/until', function (req, res) {
  const languageId = req.body.language
  const filePath = [l10nPath, languageId + '.json'].join('/')
  const until = req.body.until
  jsonfile.readFile(filePath, function (err, obj) {
    if (err) {
      console.error(err)
      res.status(500)
      res.send({error: err})
    }
    else {

    }
  })
})

