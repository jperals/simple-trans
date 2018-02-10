var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BACKEND_URL: "'http://' + location.hostname",
  BACKEND_PORT: 5000,
  MQTT_HTTP_URL: "'ws://' + location.hostname",
  MQTT_HTTP_PORT: 9000
})
