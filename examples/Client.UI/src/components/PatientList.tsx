import {
  Button,
  ButtonBase,
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Patient } from "../models/FhirTypes";
import { useStore } from "../store";

const PatientList: React.FC = () => {
  const store = useStore();
  
  const navigate = useNavigate();

  const getAge = (row: Patient) => {
    const birthDate = row.birthDate;
    if (!birthDate) {return '--'}
    const birthDateObj = new Date(birthDate);
    var ageDifMs = Date.now() - birthDateObj.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  };

  const getName = (patient: Patient) => {
    const name = `${patient?.name?.[0]?.given} ${patient?.name?.[0]?.family}`;
    return name;
  };

  const getBirthDate = (patient: Patient) => {
    const birthDate = patient.birthDate;
    if (!birthDate) {return '--'}
    const birthDateObj = new Date(birthDate);
    return birthDateObj.toLocaleDateString();
  };

  const getEmail = (patient: Patient) => {
    const email = patient.telecom?.find(t => t.system === 'email');
    return email?.value ?? '--';
  };

  const { updatePatients, state } = store 
  const { data, loading } = state.patients;
  
  return (
    <div style={{ margin: 20 }}>
      <Typography variant='h3'>Patients</Typography>
      <Divider sx={{mb: 2}}/>
      <Stack direction='row' sx={{mb: 2}}>
        <Button color='primary' variant='contained' disabled={loading} onClick={() => updatePatients()}>Update</Button>
        <Button variant='outlined' sx={{ml: 'auto'}} onClick={() => navigate('/observations')}>Go to Observations</Button>
      </Stack>

      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Birth Date</TableCell>
              <TableCell align="center">Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((patient, i) => (
              <TableRow
                key={patient.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {getName(patient)}
                </TableCell>
                <TableCell align="center">{getEmail(patient)}</TableCell>
                <TableCell align="center">
                  {getBirthDate(patient)}
                </TableCell>
                <TableCell align="center">{getAge(patient)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!data?.length && <Typography align='center' sx={{width: '100%', mx: 'auto', my: 3, textAlign: 'center'}}>No Records</Typography>}
      </TableContainer>
    </div>
  );
};

export default PatientList;
