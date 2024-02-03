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

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export default function ParameterDialog({ open, handleParamClose, handleRun, flag, handleShowCreateView }) {
  const parameters = useSelector(state => state.utility.parameters);
  const handleClose = (e) => {
    handleParamClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'xs'}    PaperProps={{ style: { width: 600, padding: 20 } }}
      onKeyDown={(event) => {
        event.stopPropagation()
        if(event.key === "Enter"){
          if(flag === 1)handleRun()
          if(flag === 2) handleShowCreateView()
        }
        
      }}
    >
      <CustomDialogTitle id="customized-dialog-title">
        Set Parameters
        <IconButton edge="end" color="inherit" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </CustomDialogTitle>
      
      <DialogContent>
          {parameters.map(item => !item.isList && (<ParameterTextField key={item.name} elName={item.name} type={item.type} defaultValue={item.default} />))}
          {parameters.map(item => item.isList && (<ParameterSelector key={item.name} elName={item.name} type={item.type} defaultValue={item.default} list={item.list} />))}
      </DialogContent>
      <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
        {flag === 1 && (
          <Button variant="contained" sx={{ float: "right" }} onClick={handleRun}>
            Run Query
          </Button>
          )}                    
        {flag === 2 && (
        <Button variant="contained" sx={{ float: "right" }} onClick={handleShowCreateView}>
          Next
        </Button>
        )}
        <Button
          variant="contained"
          sx={{ float: "right", marginRight: "15px" }}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </DialogActions>
      
    </Dialog>
    
  );
}
