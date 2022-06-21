import {
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Patient } from "../models/FhirTypes";
import { useStore } from "../store";
import { ObservationCode } from "../utils/ObservationCode";
import service from "../utils/service";
import * as _ from "lodash";
import { useNavigate } from "react-router-dom";
import MedicationRequestDetail from "./MedicationRequestDetail";


const getBirthDate = (patient: Patient) => {
  const birthDate = patient.birthDate;
  if (!birthDate) {return '--'}
  const birthDateObj = new Date(birthDate);
  return birthDateObj.toLocaleDateString();
};

const getAge = (row: Patient) => {
  const birthDate = row.birthDate;
  if (!birthDate) {return '--'}
  const birthDateObj = new Date(birthDate);
  var ageDifMs = Date.now() - birthDateObj.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
};

const getName = (patient: Patient) => {
  return `${patient?.name?.[0]?.given} ${patient?.name?.[0]?.family}`;
};

const getEmail = (patient: Patient) => {
  const email = patient.telecom?.find(t => t.system === 'email');
  return email?.value ?? '--';
};

const PatientList: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate()

  const { updatePatients, state } = store;

  const { data, loading } = state.patients;


  const renderItem = useMemo(() => {
    return data.reverse()
      .map((patient, i) => {
        const dateISO = patient?.meta?.lastUpdated?.split("T");
        return (
          <TableRow
            key={i}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {dateISO?.[0]} {dateISO?.[1]?.replace("Z", "")}
            </TableCell>
            <TableCell component="th" scope="row">
              {getName(patient)}
            </TableCell>
            <TableCell component="th" scope="row">
              {patient.id}
            </TableCell>
            <TableCell align="center">{getEmail(patient)}</TableCell>
            <TableCell align="center">
              {getBirthDate(patient)}
            </TableCell>
            <TableCell align="center">{getAge(patient)}</TableCell>
            <TableCell align="center">
              <MedicationRequestDetail patient={patient} />  
            </TableCell>
          </TableRow>
        );
      });
  }, [data]);

  return (
    <div style={{ margin: 20 }}>
      <Typography variant="h3">Patients</Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          color="primary"
          variant="contained"
          disabled={loading}
          onClick={() => updatePatients()}
        >
          Poll
        </Button>
        <Button variant='outlined' sx={{ml: 'auto'}} onClick={() => navigate('/observations')}>Go to Observations</Button>
      </Stack>

      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Last Updated</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Birth Date</TableCell>
              <TableCell align="center">Age</TableCell>
              <TableCell align="center">Medications</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderItem}</TableBody>
        </Table>
        {!data?.length && (
          <Typography
            align="center"
            sx={{ width: "100%", mx: "auto", my: 3, textAlign: "center" }}
          >
            No Records
          </Typography>
        )}
      </TableContainer>
    </div>
  );
};

export default PatientList;
