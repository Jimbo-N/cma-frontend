import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引用mock
import './mock/index.js';

import axios from 'axios';
import router from './router';
Vue.prototype.$http = axios
//axios.defaults.baseURL = "http://localhost:8090"


// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 从localStorage中获取token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['token'] = token;  // 修改这里
  }
  return config;
}, error => {
  return Promise.reject(error);
});


Vue.config.productionTip = false

Vue.use(ElementUI);
new Vue({
  router,
  el:'#app',
  render: h => h(App),
}).$mount('#app')
