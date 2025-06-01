import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const URL_BACK_END = process.env.VITE_BACK_END_URL || "http://localhost:3000"; // Defina a URL padrão ou use uma variável de ambiente

// Base da API
const api = axios.create({
  baseURL: URL_BACK_END, // Substitua pela sua URL real
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      // Aqui você pode, por exemplo, redirecionar ou mostrar um alerta
      alert("Acesso negado! (403)");
      // window.location.href = "/login"; // Descomente para redirecionar
    }
    return Promise.reject(error);
  }
);

export default {
  get: (url: string) => api.get(url),
  post: (url: string, data: unknown) => api.post(url, data),
  put: (url: string, data: unknown) => api.put(url, data),
  delete: (url: string) => api.delete(url),
};