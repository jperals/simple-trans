import Vue from 'vue'
import Router from 'vue-router'
import TranslationTable from '@/components/TranslationTable'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:project',
      name: 'TranslationTable',
      component: TranslationTable
    }
  ]
})
