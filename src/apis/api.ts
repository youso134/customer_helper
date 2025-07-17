import request from "./request";
import type {User} from '../stores/types.ts'


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






