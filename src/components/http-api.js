const api = {
  init: function (options) {
    if (options && options.url) {
      this.url = options.url
    }
    this.prefix = options && options.prefix ? options.prefix : ''
  },
  get: function (path, payload) {
    const url = this.url + this.prefix + '/' + path
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const options = {
      headers,
      method: 'GET',
      body: JSON.stringify(payload)
    }
    return fetch(url, options)
      .then((response) => {
        return response.text()
      })
      .then((response) => {
        return JSON.parse(response)
      })
  },
  put: function (path, payload) {
    const url = this.url + this.prefix + '/' + path
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const options = {
      headers,
      method: 'PUT',
      body: JSON.stringify(payload)
    }
    return fetch(url, options)
  }
}

export default api
