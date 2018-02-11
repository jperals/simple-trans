const fs = require('fs')
const l10nPath = require('./config').l10nPath

function getProjects() {
  return new Promise(function (resolve, reject) {
    console.log('getProjects')
    fs.readdir(l10nPath, function (err, files) {
      if (err) {
        reject(err)
      } else {
        const projects = []
        for (const file of files) {
          if (fs.statSync([l10nPath, file].join('/')).isDirectory()) {
            projects.push(file)
          } else {
            console.warn('This file is not a directory: ' + file)
          }
        }
        resolve(projects)
      }
    })
  })
}

module.exports = getProjects
