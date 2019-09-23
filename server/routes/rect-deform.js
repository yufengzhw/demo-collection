const path = require('path')
const rootPath = './data'
const { readJsonFile } = require('../utils/file')
const { handleData, handleErr } = require('../utils/restful-basic')

let meshData // cache mesh data, to avoid reading file for every request

module.exports = (router) => {
  router.get('/rectDeform/getMesh', async (ctx, next) => {
    if (!meshData) {
      await readJsonFile(path.join(rootPath, 'mesh.json'))
        .then(res => {
          meshData = res
          handleData(ctx, meshData)
        }).catch(err => {
          handleErr(ctx, err)
        })
      await next()
    } else {
      handleData(ctx, meshData)
      await next()
    }
  })
}
