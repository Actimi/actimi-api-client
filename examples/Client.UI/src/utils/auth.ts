import api from './service';
import { axiosInstance } from './axiosInstance';
import jwt_decode from "jwt-decode";

class ApiKeyAuth {
  static apiKey?: string;
  static exp?: Date;

  static authenticate = async () => {
    if (!this.apiKey) return false;
    const accessToken = await api.getTokenWithApiKey(this.apiKey);
    if (!accessToken) {return false;}
    var decoded = jwt_decode<{exp?: number}>(accessToken);
    if (decoded.exp){
      this.exp = new Date(decoded.exp * 1000);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      return true;
    }
    return false;
  }

  static setApiKey = (apiKey: string) => {
    this.apiKey = apiKey;
  }
  
  static isAuthenticated = () => {
    return this.apiKey && this.exp && this.exp > new Date();
  }
  
}

export default ApiKeyAuth

