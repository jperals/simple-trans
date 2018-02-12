import Vue from 'vue'
import Vuex from 'vuex'
import httpApi from './http-api'
import mqttApi from './mqtt-api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: false,
    filters: {},
    msgids: [],
    project: undefined,
    projects: [],
    translations: {}
  },
  mutations: {
    setFilter (state, {languageId, expression}) {
      state.filters[languageId] = expression
    },
    setProject (state, projectId) {
      state.project = projectId
    },
    setProjects (state, projects) {
      state.projects = projects
    },
    setTranslations (state, {translations}) {
      state.translations = translations
      state.loading = false
      for (const language in translations) {
        // Combine msgids
        // Based on this: https://stackoverflow.com/a/27664971
        state.msgids = [...new Set(state.msgids.concat(Object.keys(translations[language])))]
      }
      state.msgids = Object.keys(translations[Object.keys(translations)[0]])
    },
    setTranslation (state, {languageId, msgid, projectId, translation}) {
      state.translations[languageId][msgid] = translation
    }
  },
  actions: {
    getProjects ({ commit }) {
      httpApi.get('projects')
        .then(function (projects) {
          commit('setProjects', projects)
        })
        .catch(function (err) {
          console.error(err)
        })
    },
    getTranslations ({commit, state}) {
      state.loading = true
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
    setFilter ({commit, dispatch, state}, {languageId, expression}) {
      if (state.filters[languageId] !== expression) {
        commit('setFilter', {languageId, expression})
        dispatch('getTranslations')
      }
    },
    setTranslation ({commit}, {languageId, msgid, projectId, translation}) {
      return httpApi.put('translate', {
        languageId,
        msgid,
        projectId,
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
