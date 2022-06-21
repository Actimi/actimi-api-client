import React from 'react';
import { Observation, Patient } from './models/FhirTypes';
import api from './utils/service';
import * as _ from 'lodash';


const defaultState = {
  observations: {
    loading: false,
    data: [] as Observation[],
  }, 
  patients: {
    loading: false, 
    data: [] as Patient[],
  }
}
const StoreContext = React.createContext({
  state: defaultState, 
  updateObservations: () => {},
  updatePatients: () => {},
});

const StoreProvider: React.FC<any> = ({children}) => {
  
  const [state, setState] = React.useState(defaultState);

  const setLoading = (type: 'observations' | 'patients', loading: boolean) => {
    setState(s => ({...s, [type]: {...s[type], loading}}))
  }
  const updateDataState = (type: 'observations' | 'patients', data: Patient[]|Observation[]) => {
    setState(s => ({...s, [type]: {loading: false, data:  _.uniqBy([...data, ...s[type].data], 'id')}}))
  }
  const updateData = async (type: 'patients'| 'observations') => {
    setLoading(type, true);
    try {
      const fetchFn = type === 'patients' ? api.getPatients : api.getObservations;
      const data = await fetchFn();
      updateDataState(type, data)
    } catch (e) {
      console.error(e);
      setLoading(type, false);
    }
  }

  const value = React.useMemo(() => ({
    state,
    updateObservations: () => updateData('observations'),
    updatePatients: () => updateData('patients'),
  }), [state])
  
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => React.useContext(StoreContext);

export default StoreProvider;