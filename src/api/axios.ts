import axios from "axios";

const api = axios.create({
  baseURL: "https://shopping-list-production-0491.up.railway.app/api",
  withCredentials: true,
});

export default api;