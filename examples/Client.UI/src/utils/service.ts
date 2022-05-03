import { Patient, Observation } from '../models/FhirTypes';
import {axiosInstance} from './axiosInstance'


class Api {
  lastObservationDate?: string;
  lastPatientDate?: string;
  constructor(){ }

  getPatients = async () => {
    const params: any = {}
    if (this.lastPatientDate)
      params.afterDateTime = this.lastPatientDate;
    const { data } = await axiosInstance.get<Patient[]>('/patient', {params});

    const newLastDate = data?.[0]?.meta?.lastUpdated;
    if (newLastDate) this.lastPatientDate = newLastDate;
    return data ?? [];
  }

  getObservations = async () => {
    const params: any = {}
    if (this.lastObservationDate)
      params.afterDateTime = this.lastObservationDate;
    const { data } = await axiosInstance.get<Observation[]>('/observation', {params});

    const newLastDate = data?.[0]?.meta?.lastUpdated;
    if (newLastDate) this.lastObservationDate = newLastDate;
    return data ?? [];
  }
}

export default new Api();