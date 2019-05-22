import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloFromVux'

import personSelectorPlus from '@/components/personSelectorPlus'

Vue.use(Router)

const rt = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      components: {
        HelloWorld
      }
    },
    {
      path: '/psPlus',
      name: 'psPlus',
      components: {
        personSelectorPlus
      }
    }
  ]
})

export { rt as default }
