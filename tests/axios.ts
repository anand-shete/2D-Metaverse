import axios2, { AxiosRequestConfig, AxiosResponse } from "axios";

const axios = {
  post: async (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
      return await axios2.post(url, data, config);
    } catch (e: any) {
      return e.response;
    }
  },
  get: async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
      return await axios2.get(url, config);
    } catch (e: any) {
      return e.response;
    }
  },
  put: async (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
      return await axios2.put(url, data, config);
    } catch (e: any) {
      return e.response;
    }
  },
  delete: async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
      return await axios2.delete(url, config);
    } catch (e: any) {
      return e.response;
    }
  },
};

export default axios;
