const fs = require('fs')
const l10nPath = require('./config').l10nPath

function getLanguages(projectId) {
  return new Promise(function (resolve, reject) {
    fs.readdir([l10nPath, projectId].join('/'), function (err, files) {
      if (err) {
        reject(err);
      }
      let languages = []
      for (let file of files) {
        if (fs.statSync([l10nPath, projectId, file].join('/')).isFile()) {
          let split = file.split('.')
          if (split && split.length && split[1] === 'json') {
            languages.push(split[0])
          }
        } else {
          console.warn('This file is not a translation file: ' + file)
        }
      }
      resolve(languages)
    })
  })
}

module.exports = getLanguages
