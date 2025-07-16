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

export function Register(data: Register){
  return request({
    url: "/api/user/register",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

export function update(data: updated){
  return request({
    url: "/api/user/update",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}