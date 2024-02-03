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
import {Select, InputLabel,TextField} from '@mui/material';

const CustomTextField = styled(TextField)(({ theme }) => ({
  fontSize: 12,
  marginTop: 1,
  // pointerEvents: 'none',
  "& .MuiInputBase-input": {
    height: 0,
    fontSize: 14,
  },
  "& .MuiInputLabel-root": {
    fontSize: 14,
    transform: "translate(14px, 9px) scale(1)",
  },
}));

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: "14px",
  marginTop: 12,
}));

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export default function CreateViewDialog({ open, handleCreateViewClose, SaveView }) {
  const [viewName, setViewName] = React.useState("New View");
  const handleClose = (e) => {
    handleCreateViewClose();
  }
  const changeViewNameHandler = e => {
     setViewName(e.target.value);
  }
 const SaveClick = () => {
    SaveView(viewName);
    handleCreateViewClose();

 }
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} maxWidth={'xs'}    
      PaperProps={{ style: { width: 600, padding: 20 } }}
      onKeyDown={(event) => {
        if(event.key === "Enter"){
          event.preventDefault()
          SaveClick()
        }
      }}
    >
        <CustomDialogTitle id="customized-dialog-title">
          Create View
          <IconButton edge="end" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </CustomDialogTitle>
        
        <DialogContent>         
          <CustomTextField
            name="port"
            type="text"
            value={viewName}
            fullWidth
            variant="outlined"
            onChange={changeViewNameHandler}
          />
        </DialogContent>
        <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
          <Button
            variant="contained"
            sx={{ float: "right" }}
            onClick={SaveClick}
          >
            Save
          </Button>
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
