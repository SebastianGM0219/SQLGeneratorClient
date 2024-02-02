import * as React from 'react';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ParameterTextField from './ParameterTextField';
import ParameterSelector from './ParameterSelector';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ParameterDialog({ open, handleParamClose, handleRun, flag, handleShowCreateView }) {
  const parameters = useSelector(state => state.utility.parameters);
  const handleClose = (e) => {
    handleParamClose();
  }

  return (

    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Set Parameters
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
            {parameters.map(item => !item.isList && (<ParameterTextField key={item.name} elName={item.name} type={item.type} defaultValue={item.default} />))}
            {parameters.map(item => item.isList && (<ParameterSelector key={item.name} elName={item.name} type={item.type} defaultValue={item.default} list={item.list} />))}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          {flag === 1 && (
          <Button onClick={handleRun}>
            Run Query
          </Button>
          )}                    
          {flag === 2 && (
          <Button onClick={handleShowCreateView}>
            Create View
          </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
    
  );
}
