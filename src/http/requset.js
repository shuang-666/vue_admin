import axios from "axios";
import { Message } from "element-ui";

const service = axios.create({
  baseURL: "https://www.liulongbin.top:8888/api/private/v1",
  timeout: 30000
});

// 请求拦截器
service.interceptors.request.use(
  function(config) {
    if (config.url != "login") {
      const token = localStorage.getItem("token");
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  function(config) {
    const {
      meta: { msg, status }
    } = config.data;

    const successStatusArr = [200, 201];
    if (successStatusArr.includes(status)) {
      Message({
        message: msg,
        type: "success"
      });
      return {
        result: config.data.data
      };
    } else {
      Message({
        message: msg,
        type: "error"
      });
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default service;
