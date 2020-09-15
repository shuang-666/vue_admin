import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import moment from "moment";

Vue.filter("dateTime", v => {
  return moment(v * 1000).format("YYYY-MM-DD");
});

Vue.filter("goodsDateTime", v => {
  return moment(v * 1000).format("YYYY-MM-DD HH:mm:ss");
});

Vue.filter("levelRank", num => {
  let result = "";
  switch (num) {
    case "0":
      result = "一级";
      break;
    case "1":
      result = "二级";
      break;
    case "2":
      result = "三级";
      break;
    default:
      result = "没有等级";
  }
  return result;
});

// 组件
import BreadCrumb from "./components/breadcrumb.vue";

// 全局组件
Vue.component(BreadCrumb.name, BreadCrumb);

// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'
// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)

// 全局路由拦截
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();

  // 路由拦截
  if (to.meta.auth) {
    const token = localStorage.getItem("token");
    if (!token) {
      next({
        name: "login",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");