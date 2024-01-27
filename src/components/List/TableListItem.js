import * as React from 'react';
import { Box, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons'

import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      borderBottom: '1px solid #ddd',
      fontSize: 16,
      padding: 10,
      cursor: 'pointer'
    },
    iconStyle: {
      verticalAlign: 'middle',
      color: '#1976d2',
      marginRight: 16,
      width: 20
    },
    checkStyle: {
      fill: 'red',
    }
  };
})

const ListCheckBox = styled(Checkbox)(({theme})=> ({
  '& .MuiSvgIcon-root': {
    width: 16
  },
  padding: 2,
  marginRight: 12
}));

export default function TableListItem({ isChecked, hasKey, text, onClick, onCheckboxChange }) {
//  const [checked, setChecked] = React.useState(false);
  const {classes} = useStyles();

  const handleChange = (event) => {
    const checked = event.target.checked;
//    setChecked(checked);
    onCheckboxChange({ text, checked });
  }

  const handleClick = () => {
    onClick(text)
  }

  return (
    <Box className={classes.boxStyle} onClick={handleClick}>
      <ListCheckBox 
        checked={isChecked} 
        className={classes.checkStyle} 
        onChange={handleChange} 
      />
      {hasKey?<FontAwesomeIcon icon={faTableList} size="1x" className={classes.iconStyle}/>:<FontAwesomeIcon icon={faTableCells} size="1x" className={classes.iconStyle}/>}
      {text}
    </Box>
  )
}
