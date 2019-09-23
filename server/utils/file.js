const fs = require('fs')

const readJsonFile = function (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = {
  readJsonFile
}
