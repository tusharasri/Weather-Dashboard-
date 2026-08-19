import axios from "axios";

const hostname = window.location.hostname;
const api = axios.create({
  baseURL: `http://${hostname}:5001/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
