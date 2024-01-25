import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import TypeButton from "./TypeButton";

const useStyles = makeStyles()((theme) => {
  return {
    inputField: {
      '& .MuiInputBase-input': {
        padding: 0,
        minHeight: 32,
        paddingLeft: 8,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 14,
        borderRight: 'none'
      },
      '& .MuiInputBase-root':{
        borderRadius: '4px 0px 0px 4px'
      },
      width: '100%'
    },
    gridBox: {
      display: 'grid',
      gridTemplateColumns: '1fr auto'
    }
  }
});

export default function TypeSelector({value, onTypeChange}){
  const { classes } = useStyles();
  const [ type, setType ] = React.useState(value);

  React.useEffect(()=>{
    setType(value);
  }, [value]);

  const handleChange = (value) => {
    setType(value);
    onTypeChange(value);
  }
  return (
    <Box className={classes.gridBox}>
      <TextField 
        className={classes.inputField} 
        variant='outlined'
        value={type}
        name="parameter"
        disabled
      />
      <TypeButton iconType={type} onChangeType={handleChange}/>

    </Box>
  )
}