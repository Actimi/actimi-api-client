import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://localhost:7002",
  // baseURL: "http://localhost:3001",
  withCredentials: true,
  
});
