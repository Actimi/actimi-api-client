import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography, IconButton, Divider, ListItem, List, ListItemText } from '@mui/material';
import { Observation, QuestionnaireResponse } from '../models/FhirTypes';
import api from '../utils/service';
import InfoIcon from '@mui/icons-material/Info';
import { QuestionnaireResponseItem, QuestionnaireResponseItemAnswer } from './../models/FhirTypes';

interface Props {
  observation: Observation;
}

const getAnswerValue = (answer: QuestionnaireResponseItemAnswer) =>
  answer.value?.integer ??
  answer.value?.string ??
  answer.value?.uri ??
  answer.value?.boolean ??
  answer.value?.Coding?.display;

const flatAnswers = (items?: QuestionnaireResponseItem[]) => {
  if (!items) return []
  return items.reduce((acc, item) => {
    const obj = {
      text: item.text, 
      answer: item.answer?.map((a) => getAnswerValue(a))?.join(','),
      linkId: item.linkId
    }
    acc = [...acc, obj, ...flatAnswers(item.item)]
    return acc;
  }, [] as {text?: string, answer?: string, linkId?: string}[])
}

const QuestionnaireResponsesDetail: React.FC<Props> = ({ observation }) => {
  const [open, setOpen] = useState(false)
  const [qrs, setQrs] = useState<QuestionnaireResponse[]>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const questionnaireId = observation?.derivedFrom?.find(({resourceType, id}) => resourceType === 'QuestionnaireResponse')?.id
    if (!questionnaireId) {
      setLoading(false);
      setQrs([]);
      return;
    }
    if (!observation.basedOn)
    if (!open) return;
    (async function(){
      try {
        const data = await api.getQuestionnaireResponses({id: questionnaireId});
        if (open) setQrs(data);
      } catch (e) {
        if (open) setError((e as Error).message);
        console.error(e)
      } finally {
        if (open) setLoading(false);
      }
    })()
  }, [observation, open])

  useEffect(() => {
    if (!open) {
      setQrs(undefined);
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
        <DialogTitle>Questionnaire Response Details</DialogTitle>
        <Divider />
        <DialogContent sx={{minHeight: 250}}>
          {loading && (
            <Box width='100%' minHeight='inherit' display='flex' justifyContent='center' alignItems='center'>
              <CircularProgress />
            </Box>
          )}
          {error && <Typography>{error}</Typography>}
          {qrs?.length === 0 && <Typography>Questionnaire Response not found!</Typography>}
          {qrs?.map((qr) => (
            <Paper component={'fieldset'} variant='outlined' key={`mr-${qr.id}`} sx={{mt: 2, px: 1}}>
              <Typography component={'legend'} variant='subtitle2' sx={{mx: .5, fontWeight: 600}}>Symptoms</Typography>
              <List dense disablePadding>
                {flatAnswers(qr.item).map(({text, answer, linkId}) => (
                  <ListItem  key={`${qr.id}-answer-${linkId}`}>
                    <ListItemText primary={`${text} (${linkId})`} secondary={answer} />
                  </ListItem>
                ))}
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

export default QuestionnaireResponsesDetail;