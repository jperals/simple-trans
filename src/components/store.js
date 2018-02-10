import Vue from 'vue'
import Vuex from 'vuex'
import httpApi from './http-api'
import mqttApi from './mqtt-api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    filters: {},
    msgids: {},
    translations: {}
  },
  mutations: {
    setFilter (state, {languageId, expression}) {
      state.filters[languageId] = expression
    },
    setTranslations (state, {msgids, translations}) {
      state.msgids = msgids
      state.translations = translations
    },
    setTranslation (state, {languageId, msgid, translation}) {
      state.translations[languageId][msgid] = translation
    }
  },
  actions: {
    setFilter ({commit, dispatch}, {languageId, expression}) {
      commit.setFilter({languageId, expression})
      dispatch('getTranslations', {filters: {languageId, expression}})
    },
    getTranslations ({commit, state, filters}) {
      httpApi.get('languages')
        .then(function (languages) {
          const promises = []
          languages.forEach(function (id) {
            promises.push(httpApi.get('static/l10n/' + id + '.json'))
          })
          Promise.all(promises)
            .then(function (results) {
              const translations = {}
              const msgids = Object.keys(results[0])
              languages.forEach(function (languageId, i) {
                translations[languageId] = results[i]
              })
              commit('setTranslations', {msgids, translations})
            })
        })
        .catch(function (err) {
          console.error(err)
        })
    },
    setTranslation ({commit}, {languageId, msgid, translation}) {
      return httpApi.put('translate', {
        languageId,
        msgid,
        translation
      })
    }
  }
})

httpApi.init({
  url: process.env.BACKEND_URL + ':' + process.env.BACKEND_PORT
})

const mqttHttpPort = process.env.MQTT_HTTP_PORT || 9000
const mqttUrl = (process.env.MQTT_HTTP_URL || 'ws://localhost') + ':' + mqttHttpPort
mqttApi.connect(mqttUrl)
mqttApi.client.subscribe('set')

mqttApi.client.on('message', function (topic, message) {
  switch (topic) {
    case 'set':
      store.commit('setTranslation', JSON.parse(message.toString()))
      break
  }
})

store.dispatch('getTranslations')

export default store
