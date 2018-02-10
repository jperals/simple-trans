import mqtt from 'mqtt'

// Just a bit of abstraction needed because calling mqtt.connect() returns a new client instance...

const debug = false

class Api {
  connect (url) {
    const client = mqtt.connect(url)
    client.on('connect', function () {
      client.subscribe('presence')
      client.publish('presence', 'Connected to MQTT broker')
    })

    client.on('message', function (topic, message) {
      if (!debug) {
        return
      }
      // Message is buffer, we need to convert it to string
      let msg = message.toString()
      try {
        // If it's JSON data, log it pretty
        msg = JSON.parse(msg)
      } catch (e) {
        // If it's not JSON data, no problem, just keep msg being a string
      }
      console.log('MQTT topic:', topic)
      console.log('MQTT message:', msg)
    })

    // Only keep one client active
    if (typeof this.client !== 'undefined' && typeof this.client.end !== 'undefined') {
      this.client.end({
        force: true
      })
    }
    this.client = client
  }
  publish (msg) {
    this.client.publish(msg)
  }
}

const api = new Api()

export default api
