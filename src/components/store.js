import Vue from 'vue'
import Vuex from 'vuex'
import httpApi from './http-api'
import mqttApi from './mqtt-api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    filters: {},
    msgids: {},
    project: undefined,
    translations: {}
  },
  mutations: {
    setFilter (state, {languageId, expression}) {
      state.filters[languageId] = expression
    },
    setProject (state, projectId) {
      state.project = projectId
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
    setFilter ({commit, dispatch, state}, {languageId, expression}) {
      if (state.filters[languageId] !== expression) {
        commit('setFilter', {languageId, expression})
        dispatch('getTranslations')
      }
    },
    getTranslations ({commit, state}) {
      let url = 'translations/' + state.project
      if (state.filters && Object.keys(state.filters).length) {
        url += '?searchQuery=' + JSON.stringify(state.filters)
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

export default store
