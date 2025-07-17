import { defineStore } from "pinia";
import type { User, DialogueItem } from "@/stores/types";


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

export const useDialogStore = defineStore("dialog", {
  state: () => ({
    currentDialog: {} as DialogueItem, // 当前编辑的对话详情
  }),
  actions: {
    setCurrentDialog(dialog: DialogueItem) {
      this.currentDialog = dialog;
    },
    clearCurrentDialog() {
      this.currentDialog = {} as DialogueItem;
    },
  },
});
