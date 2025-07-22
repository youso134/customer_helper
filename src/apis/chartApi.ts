import request from "./request.ts";
export function getTypeCount() {
  return request({
    url: "type/getTypeCount",
    method: "get",
  });
}
export function getclientId() {
  return request({
    url: "chat/getAllChat",
    method: "get",
  });
}