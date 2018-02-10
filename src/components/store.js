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
    setTranslations (state, {translations}) {
      state.msgids = Object.keys(translations[Object.keys(translations)[0]])
      state.translations = translations
    },
    setTranslation (state, {languageId, msgid, translation}) {
      state.translations[languageId][msgid] = translation
    }
  },
  actions: {
    setFilter ({commit, dispatch}, {languageId, expression}) {
      commit.setFilter({languageId, expression})
      dispatch('getTranslations', {searchQuery: {languageId, expression}})
    },
    getTranslations ({commit, state, searchQuery}) {
      let url = 'translations'
      if (searchQuery) {
        url += '&searchQuery=' + searchQuery
      }
      httpApi.get(url)
        .then(function (translations) {
          commit('setTranslations', {translations})
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
