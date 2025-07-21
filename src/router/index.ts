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
    meta: { title:"主页",menuIndex: "/main" },
    children: [
      {
        path: "user",
        name: "user",
        component: () => import("@/views/User.vue"),
        meta: { title:"用户界面",menuIndex: "/main/user" },
      },
      {
        path: "alldialoglog",
        name: "alldialoglog",
        component: () => import("@/views/AllDialogLog.vue"),
        meta: { title:"查看全部聊天记录",menuIndex: "/main/alldialoglog" },
      },
      {
        path: "addoreditchat/:did?",
        name: "addoreditchat",
        component: () => import("@/views/AddorEditChat.vue"),
        meta: { title:"编辑聊天记录",menuIndex: "/main/addoreditchat" },
      },
      // {
      //   path: "addchats",
      //   name: "addchats",
      //   component: () => import("@/views/AddChats.vue"),
      //   meta: { menuIndex: "/main/addchats" },
      // },
      {
        path: "allchats",
        name: "allchats",
        component: () => import("@/views/AllChats.vue"),
        meta: { title:"所有消息管理",menuIndex: "/main/allchats" },
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
