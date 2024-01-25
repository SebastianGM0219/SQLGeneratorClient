import * as React from 'react';
import  { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogActions,TextField, DialogTitle} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { initAllState} from "../../slices/query";
import { initAllUtility} from "../../slices/utility";
import { initAllDatabaseTable} from "../../slices/database";
import { initAllTable} from "../../slices/table";
import {saveDbInformation} from "../../slices/database";
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Cookies from 'js-cookie';
import {getTables, addUpdateItem} from '../../slices/table';
import CloseIcon from '@mui/icons-material/Close';

const CustomTextField = styled(TextField)(({ theme }) => ({
  fontSize: 12,
  '& .MuiInputBase-input': {
    height: 0,
    fontSize: 14
  },
  '& .MuiInputLabel-root': {
    fontSize: 14,
    transform: 'translate(14px, 9px) scale(1)'
  }
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: 14,
  height: 25,
  // margin: 4,
  paddingLeft: 25,
  paddingRight: 25,
  paddingTop:18,
  paddingBottom: 15,
  textAlign: 'center',
}));

const CustomSelect = styled(Select)(({ theme}) => ({
  fontSize: 12,  // Set the width based on the 'width' prop
  height: '35px',  
  '& .MuiInputBase-input': {
    height: 0,
    fontSize: 12
  },
  '& .MuiInputLabel-root': {
    fontSize: 12,
    transform: 'translate(14px, 19px) scale(1)'
  }
}));
const CustomInputLabel = styled(InputLabel)(({theme}) => ({
  fontSize:'12px',
  marginTop:12,
}));
export default function NewConnection({ open, handleClose, handleConnect }) {
  const sessionDbInfos = Cookies.get('dbInfos');
  const initialDbInfosArray = sessionDbInfos ? JSON.parse(sessionDbInfos):[];
  const initialDbInfos =initialDbInfosArray&&initialDbInfosArray[0]? initialDbInfosArray[0] : {
    host: '',
    username: '',
    password: '',
    port: '',
    db: ''
  };
  const initmenu = initialDbInfosArray?initialDbInfosArray.map(item => item.connectname):[];
  const [dbInfos, setDbInfos] = useState(initialDbInfos);
  const [newButtonOpen, setNewButtonOpen] = useState(false);
  const [newName, setNewName] = useState("New Connection");
  const [index, setIndex] = useState(0);
  const [connectMenu, setConnectMenu] = useState(initmenu);
  const [selectedName, setSelectedName] = useState(""); 
  const dispatch = useDispatch();
  const [error, setError] = React.useState(false);
//  const dbInfo = useSelector(state => state.database.dbInfo);
  useEffect(() => {
    localStorage.setItem('dbQuery',"");
  }, []);  

  const changeNameHandler = e => {
    setNewName(e.target.value);
  //  setDbInfos({...dbInfos, [e.target.name]: e.target.value})
  }
  const changeHandler = e => {
    setDbInfos({...dbInfos, [e.target.name]: e.target.value})
  }
  const isUserNameValid = (url) =>
    dbInfos.username==="";
  const isHostValid = (url) =>
    dbInfos.host==="";
  const isPasswordValid = (url) =>
   dbInfos.password==="";
  const isPortValid = (url) =>
    dbInfos.port==="";
  const isDbValid = (url) =>
    dbInfos.db==="";
    
  const handleClick = e => {
    if(isUserNameValid()||isHostValid()||isPasswordValid()||isPortValid()||isDbValid()){
      setError(true);      
    } else {
 
      dispatch(initAllDatabaseTable());
      dispatch(saveDbInformation({dbInfo:dbInfos}));
      dispatch(getTables());
      dispatch(initAllState());
      dispatch(initAllUtility());
      dispatch(initAllTable());
      handleConnect(dbInfos);
    }
  }

  const handleNewDailog = () => {
    setNewButtonOpen(true);
  };

  const handleCloseNewDailog = () => {
    setNewButtonOpen(false);
  };

  const handleOkayNewDailog = () => {    
    setConnectMenu((prevMenu) => [...prevMenu, newName]);
    setSelectedName(newName); 
    setIndex( connectMenu.length);
    setNewButtonOpen(false);
  };

  const handleMenuChange = (event) => {
    setSelectedName(event.target.value);
    setIndex(event.target.value);
    setDbInfos(initialDbInfosArray[event.target.value]);
  }
  
  const handleDeleteNewDailog = () => {
    initialDbInfosArray.splice(index, 1);
    const updatedConnectMenu = [...connectMenu];
    updatedConnectMenu.splice(index, 1); // Remove one element starting at index 2
    setConnectMenu(updatedConnectMenu); 

    if(initialDbInfosArray.length==0) {
      const initialDbInfos ={
        host: '',
        username: '',
        password: '',
        port: '',
        db: ''
      };
      setIndex(0);
      setDbInfos(initialDbInfos);
    } else {
      setIndex(initialDbInfosArray.length-1);
      setDbInfos(initialDbInfosArray[initialDbInfosArray.length-1]);
    }

    Cookies.set('dbInfos', JSON.stringify(initialDbInfosArray),{ expires: 30 });
  }

  const handleSaveNewDailog = () => {
    if(isUserNameValid()||isHostValid()||isPasswordValid()||isPortValid()||isDbValid()) {
      setError(true);      
    } else {
      const newvalue = {
        ...dbInfos,      connectname: selectedName
      };

      let found = false;          
      let newArray = initialDbInfosArray.map((item) => {
        if (item.connectname === newvalue.connectname) {
          found = true;
          return newvalue; // Update the array with the new value
        }
        return item;
      });

      if (!found) {
        newArray.push(newvalue); // If not found, push new value to array
      }

      Cookies.set('dbInfos', JSON.stringify(newArray), { expires: 30 });
    }
  }

  return (  
    <Dialog open={open} onClose={handleClose} maxWidth={'xs'}    PaperProps={{  style: { width:600, paddingRight: 20, paddingLeft:10, paddingTop:20, paddingBottom:10} }}>
      <DialogTitle sx={{marmarginBottom: '15px'}}>
        New Connection
          <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          style={{ position: 'absolute', right:43, top: 23 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent width={600} >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
          <CustomButton variant="outlined" sx={{marginLeft: '2px'}} onClick={handleNewDailog}>New</CustomButton>
            <Dialog open={newButtonOpen} onClose={handleCloseNewDailog}>
              <DialogTitle>New Connection</DialogTitle>
              <DialogContent>
                <CustomTextField
                  style={{width:300}}
                  defaultValue="New connection"
                  onChange= {changeNameHandler}
                  // placeholder="Username"
                  // error={error && isUserNameValid()}
                  // helperText={error && isUserNameValid()
                  //   ? 'You have to input Username'
                  //   : ''}
                  type="text"
                  fullWidth
                  variant="outlined"

                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleOkayNewDailog} variant="contained" >Okay</Button>
                <Button onClick={handleCloseNewDailog} variant="contained">Close</Button>
              </DialogActions>
            </Dialog>          
          <CustomButton onClick={handleSaveNewDailog} variant="outlined">Save</CustomButton>
          {/* <CustomButton variant="outlined">Rename</CustomButton> */}
          <CustomButton variant="outlined" onClick={handleDeleteNewDailog} >Delete</CustomButton>   
        </div> 
        <div style={{  alignItems: 'center', paddingLeft: '4px'}}>
        <CustomInputLabel id="saved-connection-label" >Saved Connection</CustomInputLabel>
        <FormControl variant="outlined" fullWidth>
          <CustomSelect
            placeholder="Host Address"
            labelId="saved-connection-label"
            value={index}
            defaultValue={index}
            onChange={handleMenuChange}
          >
            {connectMenu.map((item, index) => (
              <MenuItem key={index} value={index}>{item}</MenuItem>
            ))}
          </CustomSelect>
        </FormControl>
        <CustomInputLabel id="saved-connection-label" >Host Address</CustomInputLabel>
        <CustomTextField
          autoFocus
          value={dbInfos.host}
          name="host"
          placeholder=""
          type="text"
          error={error && isHostValid()}
          helperText={error && isHostValid()
            ? 'You have to input Username'
            : ''}
          fullWidth
          variant="outlined"
          onChange={changeHandler}
        />
        <CustomInputLabel id="saved-connection-label">Username</CustomInputLabel>
        <CustomTextField
          name="username"
          value={dbInfos.username}
          // placeholder="Username"
          error={error && isUserNameValid()}
          helperText={error && isUserNameValid()
            ? 'You have to input Username'
            : ''}
          type="text"
          fullWidth
          variant="outlined"
          onChange={changeHandler}
        />
        <CustomInputLabel id="saved-connection-label" >Password</CustomInputLabel>        
        <CustomTextField
          name="password"
          // placeholder="Password"
          value={dbInfos.password}
          type="text"
          error={error && isPasswordValid()}
          helperText={error && isPasswordValid()
            ? 'You have to input Username'
            : ''}          
          fullWidth
          variant="outlined"
          onChange={changeHandler}
        />
        <CustomInputLabel id="saved-connection-label" >Port</CustomInputLabel>                
        <CustomTextField
          name="port"
          value={dbInfos.port}
          // placeholder="Port"
          type="text"
          error={error && isPortValid()}
          helperText={error && isPortValid()
            ? 'You have to input Username'
            : ''}

          fullWidth
          variant="outlined"
          onChange={changeHandler}
        />
        <CustomInputLabel id="saved-connection-label" >DateBase Name</CustomInputLabel>                
        <CustomTextField
          name="db"
          // placeholder="Database Name"
          type="text"
          value={dbInfos.db}
          error={error && isDbValid()}
          helperText={error && isDbValid()
            ? 'You have to input Username'
            : ''}

          fullWidth
          variant="outlined"
          onChange={changeHandler}
        />
        </div>
       
      </DialogContent>
      <DialogActions>
        <Button variant="contained" style={{marginBottom: 20}}  onClick={handleClose}>Cancel</Button>
        <Button variant="contained" style={{marginRight:14,marginBottom: 20}}onClick={handleClick}>Connect</Button>
      </DialogActions>
    </Dialog>   
  );
}