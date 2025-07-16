import request from "./request";
import type {User, Chat, Register, updated} from '../stores/types.ts'


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

export function registerUser(data: Register){
  return request({
    url: "/user/register",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

export function updateUser(data: updated){
  return request({
    url: "/user/update",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

export function getuser(uid:number) {
  return request({
    url: "/user/getLoginUser",
    method: "get",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify({'uid':uid})
  });
}
