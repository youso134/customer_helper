import request from "./request";
import type {User, Chat} from '../stores/types.ts'


export function loginUser(data: User) {
  return request({
    url: "/user/login",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

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




