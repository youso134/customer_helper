import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// 定义路由组件

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    // component: () => import("@/views/Login2.vue"),
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/main",  
    name: "main",
    component: () => import("../views/Main.vue"),
    children: [
      {
        path: "",
        name: "user",
        component: () => import("../views/User.vue"),
      },
      {
        path: "chatlog",
        name: "chatlog",
        component: () => import("../views/ChatLog.vue"),
      },
      {
        path: "allchatlog",
        name: "allchatlog",
        component: () => import("../views/AllChatLog.vue"),
      },
    ],
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
