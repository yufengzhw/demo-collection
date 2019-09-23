import axios from 'axios'

function get (url, params) {
  return axios.get(url, { params }).then(res => {
    return new Promise((resolve, reject) => {
      if (res.status === 200) {
        if (res.data.code === '0') {
          resolve(res.data.data)
        } else {
          reject(res.data.info)
        }
      }
    })
  })
}

function post (url, params) {
  return axios.post(url, params).then(res => {
    return new Promise((resolve, reject) => {
      if (res.status === 200) {
        if (res.data.code === '0') {
          resolve(res.data.data)
        } else {
          reject(res.data.info)
        }
      }
    })
  })
}

export function getMeshData () {
  return get('/rectDeform/getMesh')
}
