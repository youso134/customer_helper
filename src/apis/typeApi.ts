import request from "./request";


export function getAllType(){
  return request({
    url: "/type/getAllType",
    method: "get",
    headers: {
      "Content-Type": "application/json", 
    },
  });
}
export function addType(data: any){
  return request({
    url: "/type/addType",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}
export function updateType(data: any){
  return request({
    url: "/type/updateType",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}
export function deleteType(data: any){
  return request({
    url: "/type/deleteType",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}

