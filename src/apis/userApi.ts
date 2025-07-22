import request from "./request.ts";
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

export function getUser(userAccount:any) {
  return request({
    url: "/user/getLoginUserByAccount",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify({'userAccount':userAccount})
  });
}

