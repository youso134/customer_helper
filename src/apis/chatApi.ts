import request from "./request";
<<<<<<<< HEAD:src/apis/chatApi.ts
import type {Chat} from '../stores/types.ts'


export function getChat(data: Chat){
  return request({
    url: "/chat/getObjectChat",
========
import type {User} from '../stores/types.ts'


export function loginUser(data: User) {
  return request({
    url: "/user/login",
>>>>>>>> 1.4.0:src/apis/api.ts
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}
<<<<<<<< HEAD:src/apis/chatApi.ts
========

// export function getChat(data: Chat){
//   return request({
//     url: "/chat/getObjectChat",
//     method: "post",
//     headers: {
//       "Content-Type": "application/json", 
//     },
//     data: JSON.stringify(data)
//   });
// }

// export function getDialoguePage(data:any) {
//   return request({
//     url: "/dialogue/getDialoguePage",
//     method: "post",
//     headers: {
//       "Content-Type": "application/json", 
//     },
//     data: JSON.stringify(data)
//   });
// }

// export function getDialogueDetailByDid(data:any) {
//   return request({
//     url: "/dialogue/getDialogueDetailByDid",
//     method: "post",
//     headers: {
//       "Content-Type": "application/json", 
//     },
//     data: JSON.stringify(data)
//   });
// }

// export function addChatByBatch(data:any) {
//   return request({
//     url: "/chat/addChatByBatch",
//     method: "post",
//     headers: {
//       "Content-Type": "application/json", 
//     },
//     data: JSON.stringify(data)
//   });
// }
// export function deleteByDid(data:any) {
//   return request({
//     url: "/dialogue/deleteByDid",
//     method: "post",
//     headers: {
//       "Content-Type": "application/json", 
//     },
//     data: JSON.stringify(data)
//   });
// }


>>>>>>>> 1.4.0:src/apis/api.ts

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





