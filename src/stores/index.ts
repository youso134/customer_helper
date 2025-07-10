import { defineStore } from "pinia";
// import {} from '@/stores/norm.ts'
import type {User} from '../stores/types.ts'

// interface User {
//   uid: number;
//   userAccount: string;
//   userName: string;
//   userRole: string;
//   editTime?: string;
//   createTime?: string;
// }

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {} as User
  }),
  actions: {
    setUser(userData:User) {
      this.user = userData
    },
    clearUser(){
      this.user = {} as User
    }
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
