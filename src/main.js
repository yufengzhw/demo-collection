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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
