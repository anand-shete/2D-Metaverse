export const RENDER_API = import.meta.env.VITE_RENDER_API;
export const WS_URL = import.meta.env.VITE_WS_URL;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_RENDER_API,
  withCredentials: true,
});

export default api;
