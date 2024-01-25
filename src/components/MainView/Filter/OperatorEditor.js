import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import BuildIcon from '@mui/icons-material/Build';
import { styled } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui'
import { setJoinCommand, initFilter} from '../../../slices/query';

const useStyles = makeStyles()((theme) => {
  return {
    smFont: {
      fontSize: 11,
      fontFamily: 'monospace',
      fontStyle: 'italic'
    },
    startIcon: {
      width: 16,
      height: 16,
      padding: 8,
      color: '#1976D2'
    }
  }
});

const OperatorTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: 0,
    fontFamily: 'monospace',
    minHeight: 32
  },
  '& .MuiInputBase-input': {
    borderLeft: '1px solid #b4b4b4',
    padding: 4,
    paddingLeft: 8,
  },
  '& .MuiInputAdornment-root': {
    marginRight: 7,
    marginLeft: 7
  },
  width: '100%'
}));
const ModeOfTravelIconStyled = styled(ModeOfTravelIcon)(({ theme }) => ({
  '&:hover': {
    cursor: 'pointer',
    color: '#1976D2'
    // Add any additional styles you want to apply on hover
  },
}));

export default function OperatorEditor() {
  const { classes } = useStyles();

  const joinCommand = useSelector(state => state.query.joinCommand);
//  const initFilter = useSelector(state => state.query.initFilter);

  const [value, setValue] = React.useState(joinCommand);
  const [error, setError] = React.useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValue(e.target.value);
    dispatch(setJoinCommand(e.target.value));
    const isValid = validateText(e.target.value);
    setError(!isValid);
  }
  const handleModeOfTravelIconClick = () => {
      dispatch(setJoinCommand(""));
      dispatch(initFilter());
      
  }
  React.useEffect(() => {
    setValue(joinCommand)
  }, [joinCommand]);

  const validateText = (inputText) => {
    const numbers = inputText.match(/\d+/g);

    if (numbers) {
      const uniqueNumbers = [...new Set(numbers.map(Number))];
      for (let i = 0; i < uniqueNumbers.length; i++) {
        if (uniqueNumbers[i] !== i + 1) return false;
        if (uniqueNumbers[i] === uniqueNumbers.length) return true;
        let curPos = inputText.indexOf('{' + uniqueNumbers[i] + '}');
        if(curPos === -1) return false;
        let nextPos = inputText.indexOf('{' + uniqueNumbers[i+1] + '}', curPos+1);
        let curItem = '{' + uniqueNumbers[i] + '}';
        let fstring = inputText.substring(curPos, nextPos);
        let string = fstring.slice(curItem.length);

        if(string !== " AND " && string !==" OR ") {
          return false;
        }
      }
      return true; // Sequential order and correct patterns
    }
    return false; // No numbers found in the input text  
  }

  return (
    <Box sx={{display: 'flex', width: '100%'}}> 
      <Box>
        <BuildIcon className={classes.startIcon}/>
      </Box>
      <Box sx={{width: '100%'}}>
        <OperatorTextField
          id="operator-icon-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <ModeOfTravelIconStyled  sx={{width: 16}} className= {classes.hoverTavel} onClick={handleModeOfTravelIconClick}/>
              </InputAdornment>
            )
          }}
          value={value}
          onChange={handleChange}
          error={error}
        />
        <Typography className={classes.smFont} >{`Enter filter as string based on columns below, such as {1} AND {2} OR {3}`}</Typography>
      </Box>
    </Box>
  )
}