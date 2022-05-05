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
import React, {useEffect, useMemo, useState} from "react";
import {Patient} from "../models/FhirTypes";
import {useStore} from "../store";
import {ObservationCode} from "../utils/ObservationCode";
import service from "../utils/service";

const PatientList: React.FC = () => {
  const store = useStore();

  const [organization, setOrganization] = useState();

  const getOrganization = () => {
    if (!organization) {
      return "Not found";
    }
    return (organization as { name: string })?.name;
  };

  const getName = (patient: Patient) => {
    return `${patient?.name?.[0]?.given} ${patient?.name?.[0]?.family}`;
  };

  const { updatePatients, state } = store;

  const { data, loading, measurements } = state.patients;
  const getObservationName = (code?: string) => {

    if (!code) {
      return "";
    }
    return ObservationCode[code] ?? "";
  };

  useEffect(() => {
    service.getOrganization().then((org) => {
      console.log(org)
      setOrganization(org);
    });
  }, [data]);

  const renderItem = useMemo(() => {
    return data.map((patient, i) => {
      const _m = measurements.filter((x) => x.subject?.id == patient.id);
      if (!_m) {
        return (
          <TableRow
            key={i}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {getName(patient)}
            </TableCell>
            <TableCell component="th" scope="row">
              {patient.id}
            </TableCell>
            <TableCell align="center">{getOrganization()}</TableCell>
            <TableCell align="center">--</TableCell>
            <TableCell align="center">--</TableCell>
          </TableRow>
        );
      }
      return _m?.map((observation, obsI) => {
        const dateISO = observation?.effective?.dateTime?.split("T");
        return (
          <TableRow
            key={obsI}
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
            <TableCell align="center">{getOrganization()}</TableCell>
            <TableCell align="center">
              {getObservationName(observation?.code?.coding?.[0]?.code)}
            </TableCell>
            <TableCell align="center">
              {observation?.value?.Quantity?.value ||
                observation?.interpretation?.[0]?.coding?.[0]?.code ||
                "--"}
            </TableCell>
          </TableRow>
        );
      });
    });
  }, [data, measurements]);

  return (
    <div style={{ margin: 20 }}>
      <Typography variant="h3">Patients</Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          color="primary"
          variant="contained"
          disabled={loading}
          onClick={() => updatePatients(100, 1)}
        >
          Poll
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date Time</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell align="center">Organization</TableCell>
              <TableCell align="center">Measurement</TableCell>
              <TableCell align="center">Value</TableCell>
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
