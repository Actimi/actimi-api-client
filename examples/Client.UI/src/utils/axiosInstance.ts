import axios from "axios";

export const axiosInstance = axios.create({
  //baseURL: "https://localhost:7002",
  baseURL: "http://localhost:3000/partner",
  headers: {
    Authorization: "REQUEST TOKEN FROM ACTIMI<ramy@actimi.de>",
  },
  withCredentials: true,
});
