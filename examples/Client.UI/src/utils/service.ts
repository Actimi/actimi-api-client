import { Patient, Observation, MedicationRequest, QuestionnaireResponse } from "../models/FhirTypes";
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

  getPatients = async () => {
    const params: any = {};
    if (this.lastPatientDate) params.afterDateTime = this.lastPatientDate;
    const { data } = await axiosInstance.get<Patient[]>("/Patient", { params });

    const newLastDate = data?.[0]?.meta?.lastUpdated;
    if (newLastDate) this.lastPatientDate = newLastDate;
    return data ?? [];
  };

  getObservations = async (params: {count?: number, page?: number, subject?: string, afterDateTime?: string} = {}) => {
    if (this.lastObservationDate)
    params.afterDateTime = this.lastObservationDate;
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

  getMedicationRequests = async (params: {afterDateTime?: string, subject?: string} = {}) => {
    const {data} = await axiosInstance.get<MedicationRequest[]>('/MedicationRequest', {params});
    return data;
  }

  getQuestionnaireResponses = async (params: {afterDateTime?: string, subject?: string, id?: string} = {}) => {
    const {data} = await axiosInstance.get<QuestionnaireResponse[]>('/QuestionnaireResponse', {params});
    return data;
  }
}

export default new Api();
