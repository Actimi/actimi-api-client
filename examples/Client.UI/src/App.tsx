import React from "react";
import PatientList from "./components/PatientList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StoreProvider from "./store";
import AppContainer from "./components/AppContainer";

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route path="/" element={<AppContainer />}>
            <Route index element={<PatientList />} />
            <Route path="patients" element={<PatientList />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
