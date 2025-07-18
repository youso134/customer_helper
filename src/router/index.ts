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
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
  },
  {
    path: "/main",
    name: "main",
    redirect:"/main/user",
    component: () => import("@/views/Main.vue"),
    meta: { menuIndex: "/main" },
    children: [
      {
        path: "user",
        name: "user",
        component: () => import("@/views/User.vue"),
        meta: { menuIndex: "/main/user" },
      },
      {
        path: "alldialoglog",
        name: "alldialoglog",
        component: () => import("@/views/AllDialogLog.vue"),
        meta: { menuIndex: "/main/alldialoglog" },
      },
      {
        path: "chatlog/:did?",
        name: "chatlog",
        component: () => import("@/views/ChatLog.vue"),
        meta: { menuIndex: "/main/chatlog" },
      },
      {
        path: "allchats",
        name: "allchats",
        component: () => import("@/views/AllChats.vue"),
        meta: { menuIndex: "/main/allchats" },
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
