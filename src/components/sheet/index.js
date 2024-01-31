import React, { useRef } from 'react';
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import DownloadIcon from '@mui/icons-material/Download';
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { Box, Typography, Button } from '@mui/material';
import Sheet from './Sheet'
import { setSheetOpened } from '../../slices/utility';
import { edit } from 'ace-builds';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Result() {
  const isSheetOpened = useSelector(state => state.utility.sheetOpened);
  const data = useSelector(state => state.query.sheetContent);
  const buttonRef = useRef();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState(isSheetOpened);
  const [exportFileName, setExportFileName] = React.useState("output");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const isConnected = useSelector(state => state.database.success);

  React.useEffect(() => {
    setExpanded(isSheetOpened);
  }, [isSheetOpened])

  const handleChange = (event) => {
    setExpanded(prev => {
      dispatch(setSheetOpened(!prev));
      return !prev;
    });
  }

  const CustomTextField = styled(TextField)(({ theme }) => ({
    fontSize: 12,
    marginTop: 1,
    '& .MuiInputBase-input': {
      height: 0,
      fontSize: 12
    },
    '& .MuiInputLabel-root': {
      fontSize: 12,
      transform: 'translate(14px, 9px) scale(1)'
    }
  }));


  const exportCSV = (event) => {
    buttonRef.current.link.click();
    handleCloseEditDialog();
  }

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  }

  const handleChangeExportFileName = (e) => {
    setExportFileName(e.target.value)
  }

  return (
    <Box>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography sx={{margin: 1}}>Result</Typography>
          <Button   disabled= {!data.fields.length}  sx={{border: '1px solid #ccc', borderRadius: 2, marginLeft: '15px', padding: '5px 10px', textTransform: 'none'}} onClick={handleOpenEditDialog}>
           <DownloadIcon style={{ marginRight: '5px' }} />
            Export
          </Button>
          <CSVLink data={data.rows} filename={exportFileName} style={{display: 'none'}} ref={buttonRef}>Export</CSVLink>
        </AccordionSummary>
        <AccordionDetails>
          <Sheet/>
        </AccordionDetails>
      </Accordion>

      <Dialog 
        PaperProps={{  style: { width:400, paddingRight: 20, paddingLeft:20, paddingTop:20, paddingBottom:20} }} 
        open={editDialogOpen} onClose={handleCloseEditDialog} 
        disableRestoreFocus
      >
        <DialogTitle>Edit Export File Name</DialogTitle>
          <DialogContent>      
            <CustomTextField
              name="exportfilename"
              value={exportFileName}
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleChangeExportFileName}
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{display:'block', padding:'4px 24px'}}>
            <Button variant="contained" sx={{float: 'right'}} onClick={exportCSV}>OK</Button>
            <Button variant="contained" sx={{float: 'right', marginRight: '15px'}} onClick={handleCloseEditDialog}>Cancel</Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
}
