import axios from "axios";
import { AUTHORIZATION, backendFastApi } from "./constant";

const axiosInstance = axios.create({
  baseURL: backendFastApi,
  headers: { Authorization: AUTHORIZATION },
});

export default axiosInstance;
