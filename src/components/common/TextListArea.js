import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { makeStyles  } from 'tss-react/mui';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const useStyles = makeStyles()((theme) => {
  return {
    iconBox: {
      display: 'flex',
      alignItems: 'center'
    },
    labelFont: {
      fontSize: 15,
      color: '#b4b4b4',
      marginRight: 6
    },
    boldFont: {
      fontWeight: 600
    },
    grayColor: {
      color: '#b4b4b4',
      width: 16,
      height: 16
    }
  }
});

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
  resize: vertical;
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

export default function TextListArea({label, defaultValue, hasIcon, onChangeList}){
  const { classes } = useStyles();
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (e) => {
    setValue(e.target.value);
    onChangeList(e.target.value);
  }

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue])

  return (
    <Box>
      <Box className={classes.iconBox}>
        <Typography className={clsx(classes.labelFont, classes.boldFont)}>{label}</Typography>
        {hasIcon && <HelpOutlineIcon className={classes.grayColor}/>}
      </Box>
      <Textarea minRows={2} id="value-list" onChange={handleChange} value={value} />
    </Box>
  )
}