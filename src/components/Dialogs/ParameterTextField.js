import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Box, TextField, Typography } from '@mui/material';
import { editParameter } from '../../slices/utility';
import { makeStyles  } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => {
  return {
    paddingStyle: {
      '& .MuiInputBase-input': {
        padding: '8px 12px'
      },
      marginTop: 4,
      marginBottom: 4
    }
  };
})

export default function ParameterTextField({elName, type, defaultValue}) {
  const {classes} = useStyles();
  const [value, setValue] = React.useState(defaultValue);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValue(e.target.value);
    dispatch(editParameter({name: elName, value: e.target.value}));
  }

  React.useEffect(() => {
    setValue(defaultValue);
    dispatch(editParameter({name: elName, value: defaultValue}));
  }, [defaultValue])
  
  return (
    <Box>
      <Typography>{elName}</Typography>
      <TextField value={value} onChange={handleChange} sx={{width: 480}} className={classes.paddingStyle}/>
    </Box>
  )
} 