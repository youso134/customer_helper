import axios from "axios";
// import { ElMessage } from 'element-plus';

// const config: any = {
//   env: "prod",
//   baseURL: "http://192.168.147.111:8080/api",
// };

const service = axios.create({
  // baseURL: 'http://localhost:3000'
  baseURL: "http://192.168.147.111:8080/api",
});
const NETWORK_ERR = "网络错误";

// 请求拦截器
service.interceptors.request.use(
  function (config: any) {
    // 发送请求之前做些什么 
    return config;
  },
  function (error: any) {
    //对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res: any) => {
    const { code, data, message } = res.data;
    if (code === 200) {
      // return res.data;
      return data;
    } else {
      ElMessage.error(message || NETWORK_ERR);
      return Promise.reject(message || NETWORK_ERR);
    }
  },
  (error: any) => {
    let errMessage = "出现错误，未收到响应";
    if (error.code === "ECONNREFUSED") {
      errMessage = "后端服务未启动或端口被占用";
    } else if (error.message.includes("timeout")) {
      errMessage = "请求超时";
    } else if (error.response) {
      // HTTP 状态码错误（如 404、500）
      errMessage = `请求失败: ${error.response.status}`;
    }
    ElMessage.error(errMessage);
    return Promise.reject(error);
  }
);

function request<T=any>(options: any): Promise<T>  {
  options.method = options.method || "get";
  // 关于get请求参数调整
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }

  return service(options);
}

export default request;
