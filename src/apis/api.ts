import request from "./request";

export function postUserLogin(data: any) {
  const params = new URLSearchParams();
  params.append('userAccount', data.userAccount);
  params.append('password', data.password);

  return request({
    // url: '/api/api/user/getUserInfo',
    url: "/user/login",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params
  });
}
