import axios from 'axios';
// import { ElMessage } from 'element-plus';
// import config from '@/config';

const config: any = {
  env: 'prod'
}

const service = axios.create({
  // baseURL: config.baseApi
  baseURL: 'http://localhost:3000'
})
const NETWORK_ERR = '网络错误'

// 请求拦截器
service.interceptors.request.use(
  function (config:any) {
    // 发送请求之前做些什么
    return config
  },
  function (error:any) {
    //对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res:any) => {
    const { code, data, message } = res.data
    if (code === 200) {
      return data
    } else {
      ElMessage.error(message || NETWORK_ERR)
      return Promise.reject(message || NETWORK_ERR)
    }
  },
  (error: any) => {
    // 新增：网络错误处理
    // let errMessage = NETWORK_ERR;
    let errMessage = '网络错误';
    
    if (error.code === 'ECONNREFUSED') {
      errMessage = '后端服务未启动或端口被占用';
    } else if (error.message.includes('timeout')) {
      errMessage = '请求超时';
    } else if (error.response) {
      // HTTP 状态码错误（如 404、500）
      errMessage = `请求失败: ${error.response.status}`;
    }
    ElMessage.error(errMessage);
    return Promise.reject(error);
  }
)

function request(options:any) {

  options.method = options.method || 'get'
  // 关于get请求参数调整
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.baseApi
  }
  return service(options)
}

export default request
