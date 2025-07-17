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


export function addChatByBatch(data:any) {
  return request({
    url: "/chat/addChatByBatch",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}





