import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import myMessage from '@/utils/myMessage';
import store from "@/store";

const toLogin = () => {
  router.replace({
    path: '/login',
    query: { redirect: router.currentRoute.fullPath }
  });
}

const successTip = (msg: string) => {
  myMessage.success({
    showClose: true,
    message: msg,
    duration: 1500
  })
}

const errorTip = (msg: string) => {
  myMessage.error({
    showClose: true,
    message: msg,
    duration: 1500
  })
}

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: "http://47.103.108.152:8886",
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});

// http request 拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (store.getters.getTokenValue) {
      config!.headers!.Authorization = store.getters.getTokenValue;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// http response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse): Promise<any> => {
    if (response.status === 200) {
      // myMessage.success(response.data.msg);
      return Promise.resolve(response);
    } else {
      // return myMessage.error(response.data.msg);
      return Promise.reject(response);
    }
  },
  (error: any) => {
    const status = error.response.status;
    if (status) {
      switch (status) {
        case 400:
          errorTip("错误请求");
          break;
        case 401:
          toLogin();
          errorTip("未授权，请重新登录");
          break;
        case 403:
          errorTip("拒绝访问");
          break;
        case 404:
          errorTip("请求错误，未找到该资源");
          break;
        case 405:
          errorTip("请求方法未允许");
          break;
        case 408:
          errorTip("请求超时");
          break;
        case 500:
          errorTip("服务器端出错");
          break;
        case 502:
          errorTip("网络错误");
          break;
        case 504:
          errorTip("网络超时");
          break;
        default:
          errorTip("未知错误");
      }
    }
  }
);
export function get(url:any, params:any) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function post(url:any, params:any) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export default service;
