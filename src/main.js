import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/gloab.css';
import request from "@/utils/request";
import i18n from "@/components/SimpleMindMap/i18n";

Vue.use(ElementUI, { size: 'mini'})

Vue.config.productionTip = false

// 应用封装的request
Vue.prototype.request = request()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
