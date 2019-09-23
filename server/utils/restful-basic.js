function jsonRender (ctx, json) {
  ctx.set('Content-Type', 'application/json')
  ctx.body = json.isPrototypeOf(String) ? json : JSON.stringify(json)
}

function handleErr (ctx, err) {
  jsonRender(ctx, {
    code: '1',
    info: err,
    data: ''
  })
}

function handleSuccess (ctx) {
  jsonRender(ctx, {
    code: '0',
    info: '',
    data: 'succeed'
  })
}

function handleData (ctx, data) {
  jsonRender(ctx, {
    code: '0',
    info: '',
    data
  })
}

module.exports = {
  handleErr,
  handleSuccess,
  handleData
}
