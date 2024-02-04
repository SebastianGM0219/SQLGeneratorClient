import * as React from 'react';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import { styled } from '@mui/material/styles';

export default function Modal({ open, param, handleClose, handleOK }) {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth={'xs'} 
      onKeyDown={(event) => {
        if(event.key === "Enter")
          handleClose()
      }}
    >
      <DialogTitle>{param.title}</DialogTitle>
      <DialogContent width={400}>
        {param.content}
     </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}