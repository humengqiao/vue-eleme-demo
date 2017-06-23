import Vue from 'vue';
import App from './App';
import router from './router/router';
import store from './store'
import VueResource from 'vue-resource';
import './common/stylus/index.styl';
Vue.use(VueResource);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data:{
  	eventHub:new Vue()
  },
  router,
  store,
  render:h=>h(App)
});
