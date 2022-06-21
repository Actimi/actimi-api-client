import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography, IconButton, Divider, ListItem, List, ListItemText } from '@mui/material';
import { MedicationRequest, Patient } from '../models/FhirTypes';
import api from '../utils/service';
import InfoIcon from '@mui/icons-material/Info';


const getPeriod = (medicationRequest: MedicationRequest) => {
  const period = medicationRequest.dosageInstruction?.[0]?.timing?.repeat?.bounds?.Period;
  const startDateTimeStr = period?.start;
  const endDateTimeStr = period?.end;
  return `${
    startDateTimeStr ? new Date(startDateTimeStr).toLocaleString(): '---' 
  } - ${
    endDateTimeStr ? new Date(endDateTimeStr).toLocaleString(): '---' 
  }`
}

const getDosage = (medicationRequest: MedicationRequest) => {
  let dosage;
  dosage = medicationRequest.dosageInstruction?.[0]?.maxDosePerPeriod?.denominator
  if (dosage) return `${dosage.value} per ${dosage.unit}`
  dosage = medicationRequest.dosageInstruction?.[0]?.timing?.repeat;
  if (dosage) {
    return `${dosage.frequency} at ${dosage.timeOfDay?.join(', ')}`
  }
}

interface Props {
  patient: Patient;
}

const MedicationRequestDetail: React.FC<Props> = ({ patient }) => {
  const [open, setOpen] = useState(false)
  const [medicationRequests, setMedicationRequest] = useState<MedicationRequest[]>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    (async function(){
      try {
        const data = await api.getMedicationRequests({subject: patient.id});
        if (open) setMedicationRequest(data);
      } catch (e) {
        if (open) setError((e as Error).message);
        console.error(e)
      } finally {
        if (open) setLoading(false);
      }
    })()
  }, [patient, open])

  useEffect(() => {
    if (!open) {
      setMedicationRequest(undefined);
      setError(undefined);
      setLoading(true);
    }
  }, [open])

  return (
    <>
      <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(true)}
        >
        <InfoIcon />
      </IconButton>
      <Dialog onClose={() => setOpen(false)} open={open} maxWidth='lg' fullWidth>
        <DialogTitle>Medication Request Details</DialogTitle>
        <Divider />
        <DialogContent sx={{minHeight: 250}}>
          {loading && (
            <Box width='100%' display='flex'>
              <CircularProgress />
            </Box>
          )}
          {error && <Typography>{error}</Typography>}
          {medicationRequests?.length === 0 && <Typography>Patient has no medication!</Typography>}
          {medicationRequests?.map((medicationRequest) => (
            <Paper component={'fieldset'} variant='outlined' key={`mr-${medicationRequest.id}`} sx={{mt: 2, px: 1}}>
              <Typography component={'legend'} variant='subtitle2' sx={{mx: .5, fontWeight: 600}}>{medicationRequest.medication?.Reference?.display}</Typography>
              <List dense disablePadding>
                <ListItem>
                  <ListItemText primary='Prescripted At' secondary={medicationRequest.authoredOn && new Date(medicationRequest.authoredOn).toLocaleString()} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Dosage'  secondary={getDosage(medicationRequest)} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Period' secondary={getPeriod(medicationRequest)} />
                </ListItem>
              </List>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MedicationRequestDetail;