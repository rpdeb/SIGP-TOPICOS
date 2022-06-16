import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './assets/css/style.css'
import './registerServiceWorker'
import VueMask from 'v-mask'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
Vue.use(VueMask);

import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

import axios from "axios";
import { Model } from "vue-api-query";
Model.$http = axios;
import GoogleAuth from '@/config/google_oAuth.js'
const gauthOption = {
  clientId: '707231563844-e5cpkqrlt62gncmj6b84of5sml9lp8g9.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GoogleAuth, gauthOption)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
