import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

window.axios = require('axios');

require('@/assets/style.css');

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
