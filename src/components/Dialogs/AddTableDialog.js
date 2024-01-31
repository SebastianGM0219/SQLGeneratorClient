import * as React from 'react';
import { Box, Button, Dialog, DialogContent, DialogActions,TextField, InputAdornment, Grid, DialogTitle, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useState } from 'react';
import { faMagnifyingGlass, faQuoteRight, faCalendarDays, faList12} from '@fortawesome/free-solid-svg-icons'
import { faClockFour } from '@fortawesome/free-regular-svg-icons';
import IconButton from '@mui/material/IconButton';
import TableListItem from '../List/TableListItem';
import { useDispatch, useSelector } from "react-redux";
import {getTables, updateItem} from '../../slices/table'
import { initForeignTable } from "../../slices/query"
import { makeStyles  } from 'tss-react/mui';
import { initAllTable} from "../../slices/table";
import TableService from '../../services/TableService'
import CloseIcon from '@mui/icons-material/Close';
library.add(faMagnifyingGlass, faQuoteRight, faClockFour, faCalendarDays, faList12);

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      borderLeft: '1px solid #aaa',
      borderTop: '1px solid #aaa',
      borderBottom: '1px solid #aaa',
      borderRight: '1px solid #aaa'
    },
    listBoxStyle: {
      height: 350,
      overflowY: 'auto',      
    },
    searchStyle: {
      marginBottom: 8,
      fontSize: 12,
      width: '100%',
      '& MuiSvgIcon-root': {
        width: 16
      }
    },
    fieldBoxStyle: {
      display: 'flex',
    },
    iconStyle: {
      margin:4,
      marginRight: 4,
      width: 16
    },
    iconBlue: {
      margin:4,
      marginRight: 4,
      width: 16,
      color: '#158CE2'
    },
    iconBrown: {
      margin:4,
      marginRight: 4,
      width: 16,
      color: '#e1713b'
    },
    iconOrange: {
      margin:4,
      marginRight: 4,
      width: 16,
      color: '#e9d39f'
    },
    iconGreen: {
      margin:4,
      marginRight: 4,
      width: 16,
      color: '#6dafa7'
    },
    iconTlue: {
      margin:4,
      marginRight: 4,
      width: 16,
      color: '#41d7d5'
    },
    iconView: {
      margin:4,
      marginRight: 4,
      width: 16,
      color: '#FFE300'
    },
    iconKey: {
      margin:4,
      marginRight: 4,
      width: 16,
      color: '#006fdd'
    },
    DialogButtonStyle: {
      padding: '4px 24px',
      display: 'block'
    }
  };
})

const SearchTextField = styled(TextField)(({ theme }) => ({
  marginBottom: 8,
  fontSize: 12,
  marginTop: 1,
  width: '100%',
  '& .MuiSvgIcon-root': {
    width: 16
  },
  '& .MuiInputBase-input': {
    height: 0,
    fontSize: 12
  }
}));

const CustomDialogTitle = styled(DialogTitle)(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));


export default function AddTableDialog({ open, handleTableClose,handleAddTableClose }) {
  const dispatch = useDispatch();
  const isConnected = useSelector(state => state.database.success);
  const items = useSelector(state => state.table);
  const [selectedItem, setSelectedItem] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const {classes} = useStyles();

  const getForeignTables = async () => {
    try {
      const res = await TableService.getForeignTables();
      return res.data.rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  React.useEffect(()=> {
     if(isConnected){
      dispatch(getTables());
      getForeignTables().then((rows)=>{
        dispatch(initForeignTable({foreginTable:rows}));
      });
      dispatch(initAllTable());
    }
  }, [isConnected])

  const handleClose = () => {
    handleTableClose();
  };

  const handleClickList = (text) => {
    setSelectedItem(text);
  };
  
  const handleChange = (e)=> {
    setFilter(e.target.value)
  };

  const handleSubmit = () => {
    handleAddTableClose();
  };

  const handleCheckboxChange = ({ text, checked }) => {
    dispatch(updateItem({ text, checked }));
  };

  return (
     <Dialog
        open={open}
        onClose={handleAddTableClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{  style: { width:900, paddingRight: 20, paddingLeft:20, paddingTop:20, paddingBottom:20} }}        
        disableRestoreFocus
      >
        <CustomDialogTitle>
          Add Table Data
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </CustomDialogTitle>

      <DialogContent width={600}> 
          <Box >
          <SearchTextField
            id="outlined-start-adornment"
            InputProps={{
              startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={faMagnifyingGlass} size="1x" /></InputAdornment>,
            }}
            value={filter}
            onChange={handleChange}
            placeholder='Search'
            style={{marginBottom: '15px'}}
            autoFocus  
          />
          <Box className={classes.boxStyle} >
            <Grid container >
              <Grid item md={7} className={classes.listBoxStyle} >
                <Box>
                  {items && items.map((item => {
                    const labelId = `checkbox-list-label-${item.name}`;
                    return (
                      item.name &&item.name.toLowerCase().includes(filter) &&
                      <TableListItem 
                        key={labelId} 
                        isChecked = {item.isChecked}
                        hasKey={item.hasKey} 
                        text={item.name} 
                        onClick={handleClickList} 
                        onCheckboxChange={handleCheckboxChange}
                      />
                    );
                  }))}
                </Box>
              </Grid>
              <Grid item md={5} className={classes.listBoxStyle}>
                <Box>
                  {selectedItem && items && items.map((item => {
                    let displayData;
                    if(item.name === selectedItem) {
                      const columns = item.columns;
                      
                      displayData = columns && columns.map(column => {
                        const labelID = `field-${column.name}`
                        let IconComponent;

                        switch (column.type) {
                          case 'TimeStamp':
                            IconComponent = <FontAwesomeIcon icon={faClockFour} size="1x" className={classes.iconOrange} />;
                            break;
                          case 'Text':
                            IconComponent = <FontAwesomeIcon icon={faQuoteRight} size="1x" className={classes.iconBlue}/>;
                            break;
                          case 'Integer':
                            IconComponent = <FontAwesomeIcon icon={faList12} size="1x" className={classes.iconGreen}/>;
                            break;
                          case 'Date':
                            IconComponent = <FontAwesomeIcon icon={faCalendarDays} size="1x" className={classes.iconBrown}/>;
                            break;                            
                          default:
                            IconComponent = <FontAwesomeIcon icon={faCalendarDays} size="1x" className={classes.iconStyle}/>;
                        }
                        return (
                          <Box className={classes.fieldBoxStyle} key={labelID}>
                            {IconComponent}
                            <Typography sx={{paddingLeft: '6px'}}>{column.name.toUpperCase()}</Typography>
                          </Box>
                          
                        )
                      })
                      return displayData
                    }
                  }))}
                </Box>
              </Grid>
            </Grid>
          </Box>
          </Box>
      </DialogContent>
      <DialogActions className={classes.DialogButtonStyle}>              
        <Button variant="contained" sx={{float: 'right', marginLeft: '15px'}} onClick={handleSubmit} >
           OK
         </Button>
         <Button variant="contained" sx={{float: 'right'}} onClick={handleClose} >
           Cancel
         </Button> 
      </DialogActions>
    </Dialog>
  );
}