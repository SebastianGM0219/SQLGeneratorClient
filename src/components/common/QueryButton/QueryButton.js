import * as React from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useState, useEffect,useRef} from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';
import { makeStyles  } from 'tss-react/mui';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UnionIcon from '@mui/icons-material/Group';
import InputBase from '@mui/material/InputBase';
import { initAllState} from "../../../slices/query";
import { initAllUtility} from "../../../slices/utility";
import { initAllTable} from "../../../slices/table";
import { setAllState} from "../../../slices/query";
import { setAllUtility} from "../../../slices/utility";
import { setAllTable} from "../../../slices/table";
import { AppBar, Container, Grid, Paper, Toolbar, Typography, Snackbar } from '@mui/material';
import UnionDialog from "../../Dialogs/UnionDailog";
import {setLeftUnionData, setRightUnionData} from "../../../slices/union"
import ExpandIcon from '@mui/icons-material/PlaylistPlay';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function QueryButton({label, defaultValue, hasIcon, onChangeList}){
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = useState(false); // State for managing dialog visibility
  const [newOption, setNewOption] = useState(''); // State for storing new option input value
  const [options, setOptions] = useState(['QUERY1']);
  const [value1, setValue1] = React.useState(options[0]);
  const currentState = useSelector((state) => state); // Access the entire state
  const [unionOpen, setUnionOpen] = useState(false);
  const [minusDisable, setMinusDisable] = useState(false);
  const dispatch = useDispatch();
  const isConnected = useSelector(state => state.database.success);

  const handleIncrement = () => {
    setOpen(true); // Open the dialog when handleIncrement is clicked
  };

  const CustomTextField = styled(TextField)(({ theme }) => ({
    fontSize: 12,
    width: 300,
    '& .MuiInputBase-input': {
      height: 0,
      fontSize: 12
    },
    '& .MuiInputLabel-root': {
      fontSize: 12,
      transform: 'translate(14px, 9px) scale(1)'
    }
  }));

  const CustomizedSelect = styled(Select)((theme) => ({
      '& .MuiSvgIcon-root': {
        width: 16,
      },
      '& .MuiInputBase-input': {
        height: 0,
        fontSize: 12,
      },
  }));
  
  const handleDialogClose = () => {
    setOpen(false); 
  };

  const handleCloseUnionDialog = () => {
     setUnionOpen(false); 
  }
  
  const handleChange = (e) => {
    const sessionDbInfos = localStorage.getItem('dbQuery');
    let index = options.indexOf(e.target.value);
    let newinitialDbInfosArray= sessionDbInfos ? JSON.parse(sessionDbInfos)[index]:[];
    let table,utility, query;
//    setPreviousValue(value1); 
    setValue1(e.target.value);
    utility = newinitialDbInfosArray.utility;
    query = newinitialDbInfosArray.query;
    dispatch(setAllUtility(utility));
    dispatch(setAllState(query));
  };

  const handleAddOption = () => {
    options.push(newOption);
//    setPreviousValue(value1);     
    setMinusDisable(true);
    setValue1(newOption);        
    setOpen(false); 
    dispatch(initAllState());
    dispatch(initAllUtility());
  };

  const handleOpenUnionDialog = () => {
    const sessionDbInfos = localStorage.getItem('dbQuery');
    let items= sessionDbInfos ? JSON.parse(sessionDbInfos):[];

    const queryData= items.map( (item,index) => {
      return {
        id: options[index],
        droppable: true,
        parent: '0',
        text: options[index],
        data: item.utility.codeSQL
      }
    })

    dispatch(setLeftUnionData({left:queryData}));
    setUnionOpen(true); 
  }
  
  useEffect(() => {
    localStorage.removeItem('dbQuery');
  }, []); 

  useEffect(() => {
    const sessionDbInfos = localStorage.getItem('dbQuery');
    let index = options.indexOf(value1);
    let newinitialDbInfosArray= sessionDbInfos ? JSON.parse(sessionDbInfos):[];
    let newArray = newinitialDbInfosArray.map((item) => {
      return item;
    });

    newArray[index]= currentState;
    localStorage.setItem('dbQuery', JSON.stringify(newArray));

    const sessionDbInfos1 = localStorage.getItem('dbQuery');
    let newinitialDbInfosArray1= sessionDbInfos1 ? JSON.parse(sessionDbInfos1):[];
  },[currentState]);

  const handleDecrement = () => {

    const updatedOptions = options.filter((option, index )=> option !== value1);
    const index = options.findIndex((option) => option === value1);    
    if(options.length === 1) {
      console.log("cant delete");
    } else if(index>=1) {
      let sessionDbInfos = localStorage.getItem('dbQuery');

      let newinitialDbInfosArray= sessionDbInfos ? JSON.parse(sessionDbInfos):[];

      console.log(newinitialDbInfosArray);
      console.log("session=========");
      let sessionDbInfosarray= JSON.parse(sessionDbInfos);

      newinitialDbInfosArray.splice(index,1);
      console.log(newinitialDbInfosArray);
      localStorage.setItem('dbQuery', JSON.stringify(newinitialDbInfosArray));

      let select;
      if(index>=1)
         select = index-1;
      else
      {
         select = index;
         setMinusDisable(true);
      }
      options.splice(index,1);
      let utility = newinitialDbInfosArray[select].utility;
      let query = newinitialDbInfosArray[select].query;

      dispatch(setAllUtility(utility));
      dispatch(setAllState(query));
       setValue1(options[select]);
       setOptions(updatedOptions);
//       console.log("session=========");
//       console.log(newinitialDbInfosArray);
// //      index = options.indexOf(e.target.value);
//       let newinitialDbInfosArray= sessionDbInfos ? sessionDbInfosarray:[];
//       sessionDbInfosarray.splice(index, 1);
//       localStorage.setItem('dbQuery', sessionDbInfosarray);
//       let table,utility, query;    
//       utility = newinitialDbInfosArray.utility;
//       query = newinitialDbInfosArray.query;
//       dispatch(setAllUtility(utility));
//       dispatch(setAllState(query));
//       setValue1(options[index-1]); 
//       setOptions(updatedOptions);

    }


  };

  return (
    <Box sx={{display: 'flex'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormControl disabled= {!isConnected}>
          <CustomizedSelect
            value={value1}
            onChange={handleChange}
            sx={{
              width: 140,
              height: 33.25,
              '& .MuiSvgIcon-root': {
                width: 16
              },
              '& .MuiSelect-select': {
                height: 0,
                borderColor: '#CCCCCC',
                padding: '6px',
                paddingLeft: '17px',
                fontSize: 14
              }
            }} 
          >
            {options.map((item,index) => {
              return <MenuItem value={item}>{item}</MenuItem>
            })}
          </CustomizedSelect>
        </FormControl>
        <ButtonGroup size="small" aria-label="small outlined button group" >
          <Button disabled= {!isConnected} onClick={handleIncrement} color = 'inherit' sx={{borderColor: '#CCCCCC', height:'33.25px'}} ><AddIcon fontSize='small'/></Button>
          <Button disabled= {!isConnected||!minusDisable} onClick={handleDecrement} color = 'inherit' sx={{fontSize: 12,borderColor: '#CCCCCC', height:'33.25px'}} ><RemoveIcon fontSize='small'/></Button>  
        </ButtonGroup>      
        <Button disabled= {!isConnected} onClick={handleOpenUnionDialog} size="small" sx={{paddingLeft: '20px',  height:'33.25px',fontSize: 12, borderColor: '#CCCCCC', paddingRight: '20px', marginLeft: '18px'}} color = 'inherit' variant="outlined"   ><ExpandIcon fontSize='medium' />Union</Button>
      </div>
      <Dialog open={open} onClose={handleDialogClose} disableRestoreFocus>
        <DialogTitle>Add New Query</DialogTitle>
          <DialogContent>      
            <CustomTextField
              name="username"
              value={newOption}
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setNewOption(e.target.value)}
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleAddOption}>Add</Button>
          </DialogActions>
      </Dialog>
      <UnionDialog open={unionOpen} handleCloseUnionDialog={handleCloseUnionDialog} queryName={options}/> 
    </Box>   
  )
}