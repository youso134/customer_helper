import request from "./request";

export function postUserLogin(data: any) {
  return request({
    url: "/user/login",
    method: "post",
    headers: {
      "Content-Type": "application/json", 
    },
    data: JSON.stringify(data)
  });
}
