const mqtt = require('mqtt')
const translate = require('./translate')
const config = require('./config')

const mqttHttpPort = config.MQTT_HTTP_PORT || 9000
const mqttUrl = (config.MQTT_HTTP_URL || 'ws://localhost') + ':' + mqttHttpPort
const mqttClient = mqtt.connect(mqttUrl)

mqttClient.on('connect', function () {
  mqttClient.subscribe('presence')
  mqttClient.publish('presence', 'MQTT API connected')
})

mqttClient.on('error', (error)=>{
  console.error('MQTT', error)
})

mqttClient.on('message', function (topic, message) {
  let data = message.toString()
  try {
    data = JSON.parse(data)
  }
  catch (e) {
    // Not a JSON object
  }
  switch (data) {
    case 'set':
      translate(data)
      break;
  }
})

module.exports = mqttClient
