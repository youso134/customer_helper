import request from "./request";
import type {Chat} from '../stores/types.ts'


export function getChat(data: Chat){
  return request({
    url: "/chat/getObjectChat",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

export function getDialoguePage(data:any) {
  return request({
    url: "/dialogue/getDialoguePage",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}


export function addOrUpdateChatByBatch(data:any) {
  return request({
    url: "/chat/addOrUpdateChatByBatch",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

export function getAllChat() {
  return request({
    url: "/chat/getAllChat",
    method: "get",
    // headers: {
    //   "Content-Type": "application/json", 
    // },
  });
}
export function deleteByCid(data:any) {
  return request({
    url: "/chat/deleteByCid",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}





