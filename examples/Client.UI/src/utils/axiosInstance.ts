import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "https://actimi-strapi.herokuapp.com/partner",
  // baseURL: "https://localhost:7002",
  baseURL: "http://api.actimi.health/partner",
  withCredentials: true,
});

