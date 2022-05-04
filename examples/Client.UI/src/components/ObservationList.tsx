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
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import {Observation} from '../models/FhirTypes';
import { ObservationCode } from "../utils/ObservationCode";


const ObservationList: React.FC = () => {
  const navigate = useNavigate();
  const store = useStore();

  const getObservationName = (code: string) => {
    return ObservationCode[code] ?? '';
  };
  const getDateTime = (obs: Observation) => {
    const dateTimeStr = obs.effective?.dateTime;
    if (!dateTimeStr) return '--';
    return new Date(dateTimeStr).toLocaleString();
  }

  const { updateObservations, state } = store
  const { data, loading } = state.observations;

  return (
    <div style={{ margin: 20 }}>
      <Typography variant='h3'>Observations</Typography>
      <Divider sx={{mb: 2}}/>
      <Stack direction='row' sx={{mb: 2}}>
        <Button color='primary' variant='contained'  disabled={loading} onClick={() => updateObservations(100, 1)}>Poll</Button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((obs: Observation) => (
              <TableRow
                key={obs.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  {getObservationName(obs.code?.coding?.[0]?.code ?? '')}
                </TableCell>
                <TableCell align="center">{obs?.value?.Quantity?.value}</TableCell>
                <TableCell align="center">
                  {getDateTime(obs)}
                </TableCell>
                <TableCell align="center">{obs.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!data?.length && <Typography align='center' sx={{width: '100%', mx: 'auto', my: 3, textAlign: 'center'}}>No Records</Typography>}

      </TableContainer>
    </div>
  );
};

export default ObservationList;
