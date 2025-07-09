import request from './request';



export function getUserInfo(data: any) {
  return request({
    url: '/api/user/getUserInfo',
    method: 'get',
    data
  });
}