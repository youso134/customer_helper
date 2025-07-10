import { defineStore } from 'pinia';


export const useUserStore = defineStore('user', {
  state: () => ({
    uid: 0,
		userAccount: "",
		userName: "",
		userRole: "",
		editTime: "",
		createTime: ""
  }),
  actions: { 
    
  }
});

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    unread: 0
  }),
  actions: { /* 消息相关方法 */ }
});