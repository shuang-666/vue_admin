import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const routes = [{
    path: "/",
    name: "home",
    redirect: "/home",
    component: () => import("../views/Home.vue"),
    meta: {
      title: "首页",
      auth: true
    },
    children: [{
        path: "/home",
        name: "Home",
        component: () => import("../views/Index/Index.vue"),
        meta: {
          title: "首页",
          auth: true
        }
      },
      {
        path: "/userlist",
        name: "userlist",
        component: () => import("../views/userList/Index.vue"),
        meta: {
          title: "用户列表",
          auth: true
        }
      },
      {
        path: "/roleList",
        name: "roleList",
        component: () => import("../views/jurisdiction/Index.vue"),
        meta: {
          title: "角色列表",
          auth: true
        }
      },
      {
        path: "/jurisdiction",
        name: "jurisdiction",
        component: () => import("../views/jurisdiction/JurisdictionList.vue"),
        meta: {
          title: "权限管理",
          auth: true
        }
      },
      {
        path: "/list",
        name: "list",
        component: () => import("../views/goods/List.vue"),
        meta: {
          title: "商品列表",
          auth: true
        }
      },
      {
        path: "/goods/add",
        name: "add",
        component: () => import("../views/goods/Add.vue"),
        meta: {
          title: "添加商品",
          auth: true
        }
      },
      {
        path: "/reports",
        name: "reports",
        component: () => import("../views/reports/Index.vue"),
        meta: {
          title: "数据报表",
          auth: true
        }
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("../views/order/Index.vue"),
        meta: {
          title: "订单列表",
          auth: true
        }
      },
      {
        path: "/params",
        name: "params",
        component: () => import("../views/ClassificationParameters/Index.vue"),
        meta: {
          title: "分类参数",
          auth: true
        }
      },
      {
        path: "/categories",
        name: "categories",
        component: () => import("../views/Categories/Index.vue"),
        meta: {
          title: "商品分类",
          auth: true
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/Index.vue"),
    meta: {
      title: "登录"
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;