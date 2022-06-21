import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Observation } from '../models/FhirTypes';
import { ObservationCode } from "../utils/ObservationCode";
import QuestionnaireResponsesDetail from "./QuestionnaireResponsesDetail";



const ObservationList: React.FC = () => {
  const navigate = useNavigate();
  const store = useStore();

  const { updateObservations, state } = store
  const { data, loading } = state.observations;

  return (
    <div style={{ margin: 20 }}>
      <Typography variant='h3'>Observations</Typography>
      <Divider sx={{mb: 2}}/>
      <Stack direction='row' sx={{mb: 2}}>
        <Button color='primary' variant='contained'  disabled={loading} onClick={() => updateObservations()}>Poll</Button>
        <Button variant='outlined' sx={{ml: 'auto'}} onClick={() => navigate('/patients')}>Go to Patients</Button>
      </Stack>

      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align='center'>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((obs: Observation) => <Row key={`obs-row-${obs.id}`} observation={obs} />)}
          </TableBody>
        </Table>
        {!data?.length && <Typography align='center' sx={{width: '100%', mx: 'auto', my: 3, textAlign: 'center'}}>No Records</Typography>}

      </TableContainer>
    </div>
  );
};

const getDateTime = (obs: Observation) => {
  const dateTimeStr = obs.effective?.dateTime;
  if (!dateTimeStr) return '--';
  return new Date(dateTimeStr).toLocaleString();
}
const getObservationName = (code: string) => {
  return ObservationCode[code] ?? '';
};

const Row: React.FC<{observation: Observation}> = ({observation}) => {

  const {code, value, status } = observation;

  const observationType = useMemo(() => {
    switch (observation.code?.coding?.[0]?.code) {
      case '45853-9':
        return 'SYMPTOM'
    }
  }, [observation])
  
  return (
    <>
    <TableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">
        {getObservationName(code?.coding?.[0]?.code ?? '')}
      </TableCell>
      <TableCell align="center">{value?.Quantity?.value}</TableCell>
      <TableCell align="center">
        {getDateTime(observation)}
      </TableCell>
      <TableCell align="center">{status}</TableCell>
      <TableCell>
        {observationType === 'SYMPTOM' && (
          <QuestionnaireResponsesDetail observation={observation} />
        )}
      </TableCell>
    </TableRow>
    </>
  )
}

export default ObservationList;
