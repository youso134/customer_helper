import request from "./request";

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

export function getDialogueDetailByDid(data:any) {
  return request({
    url: "/dialogue/getDialogueDetailByDid",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

export function deleteByDid(data:any) {
  return request({
    url: "/dialogue/deleteByDid",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

export function getTypes() {
  return request({
    url: "/dialogue/getTypes",
    method: "get",
    headers: {
      "Content-Type": "application/json", 
    },
    // data: JSON.stringify()
  });
}






