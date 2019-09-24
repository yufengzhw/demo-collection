import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      exact: true,
      redirect: '/rubicCube'
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/planeDeform',
      name: 'plane-deform',
      component: () => import('./views/plane-deform/plane-deform.vue')
    },
    {
      path: '/labelPoint',
      name: 'label-point',
      component: () => import('./views/label-point/label-point.vue')
    },
    {
      path: '/rubicCube',
      name: 'rubic-cube',
      component: () => import('./views/rubic-cube/rubic-cube.vue')
    }
  ]
})
