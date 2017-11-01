import Vue from 'vue'
import Router from 'vue-router'

import MainH from '@/components/Main'
import SuccessH from '@/components/Success'
import HasRegisteredH from '@/components/HasRegistered'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainH
    },
    {
      path: '/success',
      name: 'Success',
      component: SuccessH
    },
    {
      path: '/hasRegistered',
      name: 'HasRegistered',
      component: HasRegisteredH
    }
  ]
})
