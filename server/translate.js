const jsonfile = require('jsonfile')
const l10nPath = 'static/l10n'

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

module.exports = translate
