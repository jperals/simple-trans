const mosca = require('mosca')

const config = require('./config')

function init() {

  const broker = new mosca.Server({
    "port": config.MQTT_PORT || 1883,
    "http": {
      "url": config.MQTT_HTTP_URL || "ws://localhost",
      "port": config.MQTT_HTTP_PORT || 9000,
      "bundle": true,
      "static": "./"
    }
  })

  broker.on('ready', function () {
    console.log('Mosca server is up and running')
  })
  broker.on('clientConnected', function (client) {
    console.log('Client connected', client.id)
  })
// Fired when a message is received
  broker.on('published', function (packet, client) {
    let payload = packet.payload;
    try {
      payload = payload.toString()
    } catch (e) {
      // Not a string, no problem
      try {
        payload = JSON.parse(payload)
      } catch (e) {
        // Not a JSON object, no problem
      }
    }
    console.log('Published message:', payload)
  })

}

module.exports = {
  init
}
