export const RENDER_API = import.meta.env.VITE_BASE_API_URL;
export const WS_URL = import.meta.env.VITE_WS_URL;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

export default api;
