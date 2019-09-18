import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/css/theme.styl'
import echartsGL from 'echarts-gl'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/font-icon/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$echarts = require('echarts/lib/echarts')
Vue.prototype.$echartsGL = echartsGL
Vue.use(ElementUI)

Vue.prototype.$keyCodeValue = {
  n0: 48,
  w: 87,
  s: 83,
  q: 81,
  r: 82,
  l: 76,
  c: 67,
  g: 71,
  u: 85,
  d: 68,
  f: 70,
  b: 66
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
