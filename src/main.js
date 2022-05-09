// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'//等效于from './router/index.js'  是node加载的方式
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCoreVideoPlayer from 'vue-core-video-player'
import axios from 'axios'
import qs from 'qs';

Vue.prototype.$qs = qs
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api' //每次发送的请求都会带一个/api的前缀
Vue.config.productionTip = false

Vue.use(VueCoreVideoPlayer)
Vue.use(VueRouter);//引入router
Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,   //属性值和属性名一样时省略 router:router
  components: { App },
  template: '<App/>'
})
