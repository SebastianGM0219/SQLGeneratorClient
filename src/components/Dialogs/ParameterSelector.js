import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Select, MenuItem, Typography } from '@mui/material';
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

export default function ParameterSelector({elName, type, defaultValue, list}) {
  const {classes} = useStyles();
  const initialValue = defaultValue? defaultValue: '';
  const [value, setValue] = React.useState(initialValue);
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
    <Box sx={{width: '100%'}}>
      <Typography>{elName}</Typography>
      <Select sx={{width: '100%', marginBottom:'12px'}} onChange={handleChange} value={value} className={classes.paddingStyle}>
        {list.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
} 