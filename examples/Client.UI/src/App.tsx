import React from "react";
import PatientList from "./components/PatientList";
import ObservationList from "./components/ObservationList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StoreProvider from "./store";
import { Container } from "@mui/material";
import AppContainer from "./components/AppContainer";

function App() {
  return (
    <BrowserRouter>
        <StoreProvider>
          <Routes>
            <Route path="/" element={<AppContainer />}>
              <Route index element={<ObservationList />} />
              <Route path="patients" element={<PatientList />} />
              <Route path="observations" element={<ObservationList />} />
            </Route>
          </Routes>
        </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
