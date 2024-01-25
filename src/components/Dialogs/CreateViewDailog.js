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
import {Select, InputLabel,TextField} from '@mui/material';

const CustomTextField = styled(TextField)(({ theme }) => ({
  fontSize: 12,
  '& .MuiInputBase-input': {
    height: 0,
    fontSize: 12
  },
  '& .MuiInputLabel-root': {
    fontSize: 12,
    transform: 'translate(14px, 9px) scale(1)'
  }
}));

const CustomInputLabel = styled(InputLabel)(({theme}) => ({
  fontSize:15,
  marginTop:12,
}));

export default function CreateViewDialog({ open, handleCreateViewClose, SaveView }) {
  const [viewName, setViewName] = React.useState("");
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
    <Dialog open={open} onClose={handleClose} maxWidth={'xs'}    PaperProps={{  style: { width:600, paddingRight: 20, paddingLeft:20, paddingTop:10, paddingBottom:10 } }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          CreateView
        </DialogTitle>
        <DialogContent>
          <CustomInputLabel id="saved-connection-label" >View Name</CustomInputLabel>                
          <CustomTextField
            name="port"
            type="text"
            value={viewName}
            fullWidth
            variant="outlined"
            onChange={changeViewNameHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
          <Button onClick={SaveClick}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
  );
}
