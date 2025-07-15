import { defineStore } from "pinia";
// import {} from '@/stores/norm.ts'
import type { User } from "../stores/types.ts";

// interface User {
//   uid: number;
//   userAccount: string;
//   userName: string;
//   userRole: string;
//   editTime?: string;
//   createTime?: string;
// }

export function initAllLog() {
  return {
    totalAmount: 600,
    pages: 4,
    content: [
      {
        id: 1,
        name: "Alice",
        message: "你好，这是第一条消息",
        category: "技术",
      },
      { id: 2, name: "Bob", message: "第二条聊天记录在这里", category: "生活" },
      { id: 3, name: "Charlie", message: "这是另一条信息", category: "技术" },
      { id: 4, name: "David", message: "周末计划安排", category: "娱乐" },
      { id: 5, name: "David", message: "周末计划安排", category: "出行" },
      { id: 6, name: "David", message: "周末计划安排", category: "生活" },
      { id: 7, name: "David", message: "周末计划安排", category: "美食" },
    ],
  };
}

export function searchLog() {
  return {
    amount: 6,
    pages: 4,
    content: [
      {
        id: 1,
        name: "Alice",
        message: "你好，这是第一条消息",
        category: "技术",
      },
      { id: 2, name: "Bob", message: "第二条聊天记录在这里", category: "生活" },
      { id: 3, name: "Charlie", message: "这是另一条信息", category: "技术" },
      { id: 4, name: "David", message: "周末计划安排", category: "娱乐" },
      { id: 5, name: "David", message: "周末计划安排", category: "出行" },
      { id: 6, name: "David", message: "周末计划安排", category: "生活" },
      { id: 7, name: "David", message: "周末计划安排", category: "美食" },
    ],
  };
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {} as User,
  }),
  actions: {
    setUser(userData: User) {
      this.user = userData;
    },
    clearUser() {
      this.user = {} as User;
    },
  },
});

export const useMessageStore = defineStore("message", {
  state: () => ({
    messages: [],
    unread: 0,
  }),
  actions: {
    /* 消息相关方法 */
  },
});
