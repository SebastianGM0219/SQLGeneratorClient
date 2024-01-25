import * as React from 'react';
import { Box, Typography, InputBase, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { makeStyles  } from 'tss-react/mui';
import { alpha, styled } from '@mui/material/styles';
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles()((theme) => {
  return {
    headerBox: {
      padding: 24,
      borderBottom: '1px solid #eeeeee',
    },
    headerFont: {
      fontWeight: 600,
      color: '#0D1F3A'
    },
    labelFont: {
      fontSize: 20,
      fontWeight: 600,
      color: '#424450'
    },
    typoFont: {
      fontSize: 15,
      fontWeight: 600,
      color: '#424450',
      marginTop: 8
    },
    textareaStyle: {
      resize: 'vertical',
      marginTop: 4
    },
    checkboxStyle: {
      marginTop: 8,
      marginBottom: 8,
    },
    boxBorderTop: {
      borderTop: '1px solid #eeeeee'
    },
    dependantIcon: {
      width: 48,
      height: 48
    },
    dependantBox: {
      display: 'flex',
      justifyContent: 'center',
      padding: 32
    },
    notifyFont: {
      fontSize: 15,
      color: '#b4b4b4',
      marginTop: 8
    }
  }
});

const QueryInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(4),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    border: '1px solid',
    borderColor: '#b4b4b4',
    fontSize: 14,
    width: '100%',
    padding: '5px 7px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  box-sizing: border-box; 
  border-radius: 4px 4px 0 4px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

export default function QueryProperty() {
  const { classes } = useStyles();
  const isConnected = useSelector(state => state.database.success);

  return (
    <Box>
      <Box className={classes.headerBox}>
        <Typography className={classes.headerFont}>Query Propterties</Typography>
      </Box>
      <Box sx={{padding: 1.5}}>
        <Box>
          <FormControl variant="standard" sx={{ width: '100%'}}>
            <Typography  className={classes.typoFont}>Query name</Typography>
            <QueryInput disabled= {!isConnected} defaultValue="" id="query-input" placeholder='Enter query name' />
          </FormControl>
          <FormControl variant="standard" sx={{ width: '100%'}}>
            <Typography className={classes.typoFont}>Query description</Typography>
            <Textarea disabled= {!isConnected} className={classes.textareaStyle} aria-label="query-descriptioin" placeholder="Enter query description" />
          </FormControl>
          <FormControl variant="standard" sx={{ width: '100%'}} disabled= {!isConnected}>
            <Typography className={classes.typoFont}>Limit</Typography>
            <QueryInput  defaultValue="100000" id="query-limit" placeholder='Enter a row limit' />
          </FormControl>
          <FormControl variant="standard" sx={{ width: '100%'}}>
            <FormControlLabel className={classes.checkboxStyle} control={<Checkbox  disabled= {!isConnected} name="distinct"/>} label="Show only distinct rows" />
          </FormControl>
        </Box>
        <Box className={classes.boxBorderTop}>
          <Typography className={classes.typoFont}>Dependants</Typography>
          <Box className={classes.dependantBox}>
            <Typography className={classes.notifyFont}>No dependants found</Typography>
          </Box>
        </Box>
      </Box>
      
    </Box>
  )
}