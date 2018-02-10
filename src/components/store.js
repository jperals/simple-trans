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
    setFilter (state, { languageId, expression }) {
      state.filters[languageId] = expression
    },
    setTranslations (state, { msgids, translations }) {
      state.msgids = msgids
      state.translations = translations
    }
  },
  actions: {
    setFilter ({ state }, { languageId, expression }) {

    },
    getTranslations ({ commit, state }) {
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
            commit('setTranslations', { msgids, translations })
          })
      })
      .catch(function (err) {
        console.error(err)
      })
    }
  }
})

httpApi.init({
  url: process.env.BACKEND_URL + ':' + process.env.BACKEND_PORT
})

mqttApi.connect(process.env.MQTT_HTTP_URL + ':' + process.env.MQTT_HTTP_PORT)

store.dispatch('getTranslations')

export default store
