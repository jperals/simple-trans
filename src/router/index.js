import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import TranslationTable from '@/components/TranslationTable'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/:project',
      name: 'TranslationTable',
      component: TranslationTable
    }
  ]
})
