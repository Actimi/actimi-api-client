import React from "react";
import { Observation, Patient } from "./models/FhirTypes";
import api from "./utils/service";
import * as _ from "lodash";

const defaultState = {
  observations: {
    loading: false,
    data: [] as Observation[],
    measurements: [] as Observation[],
  },
  patients: {
    loading: false,
    data: [] as Patient[],
    measurements: [] as Observation[],
  },
};
const StoreContext = React.createContext({
  state: defaultState,
  updateObservations: (count: number, page: number) => {},
  updatePatients: (count: number, page: number) => {},
  getObservations: (count: number, page: number, subject: string) =>
    [] as unknown as Promise<Observation[]>,
});

const StoreProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = React.useState(defaultState);

  const setLoading = (type: "observations" | "patients", loading: boolean) => {
    setState((s) => ({ ...s, [type]: { ...s[type], loading } }));
  };
  const updateDataState = (
    type: "observations" | "patients",
    data: Patient[] | Observation[],
    measurements: Observation[]
  ) => {
    setState((s) => ({
      ...s,
      [type]: {
        loading: false,
        data: _.uniqBy([...data, ...s[type].data], "id"),
        measurements: _.uniqBy(
          [...measurements, ...s[type]?.measurements!],
          "id"
        ),
      },
    }));
  };
  const updateData = async (
    type: "patients" | "observations",
    _count: number,
    _page: number
  ) => {
    setLoading(type, true);
    try {
      const fetchFn = () =>
        type === "patients"
          ? api.getPatients(_count, _page)
          : api.getObservations(_count, _page);
      const data = await fetchFn();
      if (type == "patients") {
        for (const patient of data) {
          const measurements = await api.getObservations(3, 0, patient.id);
          updateDataState(type, data, measurements);
        }
      } else {
        updateDataState(type, data, []);
      }
    } catch (e) {
      console.error(e);
      setLoading(type, false);
    }
  };

  const getData = async (
    type: "patients" | "observations",
    _count: number,
    _page: number,
    patient?: string
  ): Promise<Observation[]> => {
    setLoading(type, true);
    try {
      const fetchFn = () =>
        type === "patients"
          ? api.getPatients(_count, _page)
          : api.getObservations(_count, _page, patient);
      return (await fetchFn()) as Observation[];
    } catch (e) {
      console.error(e);
      setLoading(type, false);
      return [];
    }
  };

  const value = React.useMemo(
    () => ({
      state,
      updateObservations: (count: number, page: number) =>
        updateData("observations", count, page),
      getObservations: (count: number, page: number, subject: string) =>
        getData("observations", count, page, subject),
      updatePatients: (count: number, page: number) =>
        updateData("patients", count, page),
    }),
    [state]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => React.useContext(StoreContext);

export default StoreProvider;
