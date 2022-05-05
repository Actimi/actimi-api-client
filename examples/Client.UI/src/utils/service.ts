import { Patient, Observation } from "../models/FhirTypes";
import { axiosInstance } from "./axiosInstance";
import {AxiosError} from "axios";

class Api {
  lastObservationDate?: string;
  lastPatientDate?: string;
  constructor() {}

  getOrganization = async () => {
    const { data } = await axiosInstance.get("/Organization");
    return data;
  };

  getPatients = async (_count: number, _page: number) => {
    const params: any = {};
    if (this.lastPatientDate) params.afterDateTime = this.lastPatientDate;
    params.count = _count;
    params.page = _page;
    const { data } = await axiosInstance.get<Patient[]>("/Patient", { params });

    const newLastDate = data?.[0]?.meta?.lastUpdated;
    if (newLastDate) this.lastPatientDate = newLastDate;
    return data ?? [];
  };

  getObservations = async (_count: number, _page: number, subject?: string) => {
    const params: any = {};
    if (this.lastObservationDate)
      params.afterDateTime = this.lastObservationDate;
    params.count = _count;
    params.page = _page;
    params.subject = subject;
    const { data } = await axiosInstance.get<Observation[]>(`/Observation`, {
      params,
    });

    const newLastDate = data?.[0]?.meta?.lastUpdated;
    if (newLastDate) this.lastObservationDate = newLastDate;
    return data ?? [];
  };

  getTokenWithApiKey = async (apiKey: string) => {
    try {
      const { data: {accessToken} } = await axiosInstance.post<{accessToken: string}>('Auth/token', { apiKey });
      return accessToken;
    } catch (e) {
      if ((e as AxiosError).code === '500') throw new Error('apikey/invalid');
      else throw e;
    }
  }
}

export default new Api();
