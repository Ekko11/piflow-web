import Vue from 'vue';
import App from './App.vue';

import Cookies from 'js-cookie';

import iView from 'view-design';
import './assets/style/my-theme.less';
import en from 'view-design/dist/locale/en-US';
import zh from 'view-design/dist/locale/zh-CN';
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);
Vue.use(iView, {
  i18n: function (path, options) {
    let value = i18n.t(path, options)
    if (value !== null && value !== undefined) {
      return value
    }
    return ''
  }
});
Vue.locale = () => { };

let lang = Cookies.get('lang');
const i18n = new VueI18n({
  locale: lang ? lang : 'zh', // 语言标识
  messages: {
    'zh': Object.assign(require('./assets/language/zh-CN'), zh), // 中文语言包
    'en': Object.assign(require('./assets/language/en-US'), en) // 英文语言包
  }
});


import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

import './assets/style/gloable.scss';
import 'font-awesome/css/font-awesome.css'

import event from './utils/event';
Vue.prototype.$event = event;

import 'xe-utils'
import VXETable from 'vxe-table'
import './assets/style/my-vxe-table.scss';

Vue.use(VXETable)

import Treeselect from '@riophae/vue-treeselect' // 导入vue-treeselect
import '@riophae/vue-treeselect/dist/vue-treeselect.css' // 导入样式

import {Notification} from 'element-ui'
Vue.prototype.$notify = Notification;

Vue.component('Treeselect', Treeselect); // 注册组件

import store from './store';

import axios from 'axios';
import qs from 'qs';
axios.defaults.withCredentials = false;
axios.interceptors.request.use(
  config => {
    // 这里的config包含每次请求的内容
    let token = store.state.variable.token;
    if (!token) {
      // token = `${window.sessionStorage.getItem("token")}`
      token = `${Cookies.get('token')}`
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(response => {
  if (response) {
    switch (response.data.code) {
      case 401:
        iView.Modal.warning({
          title: 'πFlow system tips',
          content: 'Authentication failed, please log in again',
          onOk:()=>{
            router.replace({
              path: '/login',
            })
          }
        });
        break;
      case 403:
        window.sessionStorage.clear();     //删除用户信息
        //如果超时就处理 ，指定要跳转的页面(登陆页)
            iView.Modal.warning({
              title: 'πFlow system tips',
              content: 'The token is invalid, please log in again!',
              onOk:()=>{
                router.replace({
                  path: '/login',
                })
              }
            });
        break;
    }
  }
  return response;
}, error => {
  Vue.prototype.$event.emit("loading", false);
     iView.Message.error({
    content: error,
    duration: 3,
  });
  return Promise.reject(error.response.data)
})

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;

Vue.config.productionTip = false;


//引入路由文件
import router from './router';
//// 路由拦截
const whiteList = ['/login','/home']; //不需要登录能访问的path
router.beforeEach((to, from, next) => {
  let state = Cookies.get('state'); //获取缓存看是否登录过
  if (state == 'jwtok') { //登录过来直接进去
    next();
  } else {
    if ( whiteList.includes(to.path) || to.path.includes('home')) {
      next();
    } else{
      next({path: '/home'});
    }
  }
});


async function startApp() {
  let API_URL;
  await axios.get('/config.json').then((res) => {
    if(process.env.NODE_ENV == 'development'){
      API_URL = res.data.DEV_URL;
    }else{
      let url = res.data.BASE_URL.replace('0.0.0.0',window.location.hostname);

      API_URL = url;
    }

    axios.defaults.baseURL = API_URL;
    Cookies.set('basePath', API_URL);
    Vue.prototype.$url = API_URL;
  });

  new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}
startApp();
