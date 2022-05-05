import { Button, Dialog, DialogContentText, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import {useState} from 'react';
import ApiKeyAuth from "../utils/auth";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { AxiosError } from 'axios';


declare type AuthIconProps = {isAuth: boolean}
const AuthIcon: React.FC<AuthIconProps> = ({isAuth}) => (
  isAuth ? <LockIcon /> : <LockOpenIcon />
)

const AuthForm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const handleAuthentication = async (e: any) => {
    e.preventDefault?.();
    if (loading || !apiKey?.length) return;
    setLoading(true);
    ApiKeyAuth.setApiKey(apiKey);
    try {
      if (await ApiKeyAuth.authenticate()){
        setIsAuthenticated(true);
        closeForm();
      };
    } catch (e: any) {
      console.log(e)
      if ((e as AxiosError).response?.status === 401) {
        setError("API key is invalid!");
      } else {
        setError(e.message);
      }
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  const closeForm = () => {
    setApiKey('')
    setError('')
    setFormOpen(false)
  }

  return (
    <>
    <Button 
      variant="outlined"
      color={isAuthenticated ?'success':  'warning'}
      onClick={() => setFormOpen(true)}
      endIcon={<AuthIcon isAuth={isAuthenticated} />}>
        Auth
      </Button>
      <Dialog maxWidth='sm' fullWidth open={formOpen} onClose={closeForm}>
        <form onSubmit={handleAuthentication}>
        <DialogTitle>Auth</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            margin="dense"
            label="Api Key"
            fullWidth
            variant="standard"
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button type='submit'>Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default AuthForm