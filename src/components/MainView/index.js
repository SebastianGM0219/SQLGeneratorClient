import * as React from 'react'
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { makeStyles  } from 'tss-react/mui';
import { Box, ToggleButton, ToggleButtonGroup, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGears, faCode} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux";
import { TabView, CodeView } from './view'
import { setEdited } from '../../slices/utility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import QueryButton from '../common/QueryButton/QueryButton'


const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  textTransform: 'none',
  width: 120,
  '& .svg-inline--fa': {
    marginRight: 6
  },
  fontSize: 12,
}));

const useStyles = makeStyles()((theme) => {
  return {
    fullHeight: {
      height: '91%',
      padding: 0
    },
    restHeight: {
      height: 'calc(100% - 55px)'
    }
  };
})

export default function MainView() {
  const { classes } = useStyles();
  const [alignment, setAlignment] = React.useState('builder');
  const [successOpen, setSuccessOpen] = React.useState(false)
  const [failOpen, setFailOpen] = React.useState(false)
  const isConnected = useSelector(state => state.database.success);
  const dispatch = useDispatch();

  const handleChange = (event, newAlignment) => {
    if(newAlignment!==null)
      setAlignment(newAlignment);
    if(newAlignment === "builder") dispatch(setEdited(false));
    // else dispatch(setEdited(false));
  };

  return (
    <Box className={classes.fullHeight} >
      <Box>
        <Box sx={{display: 'flex', padding: '14px',  justifyContent: 'space-between'}}>
          <QueryButton />
          <ToggleButtonGroup disabled= {!isConnected}
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <CustomToggleButton value="builder"><FontAwesomeIcon icon={faGears} size="1x"/>Builder</CustomToggleButton>
            <CustomToggleButton value="sql"><FontAwesomeIcon icon={faCode} size="1x"/>SQL</CustomToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Box sx={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", overflowY: "auto"}} className={classes.restHeight}>
         {alignment==="builder" && <TabView setSuccessOpen = {setSuccessOpen} setFailOpen = {setFailOpen} />}
         {alignment!=="builder" && <CodeView setSuccessOpen = {setSuccessOpen} setFailOpen = {setFailOpen} />}
      </Box>
      {
        successOpen ? 
          (
            <Alert sx={{padding: "4px 12px", marginTop: "7px", bgcolor:'transparent', color: '#2e7d32'}}icon={<CheckCircleIcon fontSize="inherit" />} severity="success">
              Query Syntax is good
            </Alert>
          ) : null     
      }         
      {
        failOpen ?
          (  
            <Alert sx={{padding: "4px 12px", marginTop: "7px", bgcolor:'transparent', color: 'rgb(211, 47, 47)'}} icon={<ErrorIcon fontSize="inherit" />} severity="error">
              Invalid Syntax
            </Alert>       
          ) : null
      }      
    </Box>
  )
}