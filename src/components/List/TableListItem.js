import * as React from 'react';
import { Box, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      borderBottom: '1px solid #ddd',
      fontSize: 16,
      padding: 4,
      paddingLeft: 14,
      cursor: 'pointer'
    },
    iconStyle: {
      verticalAlign: 'middle',
      color: '#1976d2',
      marginRight: 16,
      width: 20
    },
    iconViewStyle: {
      verticalAlign: 'middle',
      color: '#FFE300',
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

  const tables = useSelector(state => state.table); 
  const isView = (name) => {
    const filterTable = tables.filter(item => item.name ===name)[0];
    // console.log("valueeee");
    // console.log(filterTable?filterTable.table_type.isView:0);
    // console.log("valueeee");

    return filterTable?filterTable.table_type.isView:0;
//    console.log(filterTable.table_type.isView);
  }

  const isViewType = isView(text);  
  console.log("ViewType" + isViewType);

  
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
      {isViewType==='1' ?(<FontAwesomeIcon icon={faTableCells} size="1x" className={classes.iconViewStyle}/>):
        (hasKey?<FontAwesomeIcon icon={faTableList} size="1x" className={classes.iconStyle}/>:
          <FontAwesomeIcon ic on={faTableCells} size="1x" className={classes.iconStyle}/>)}
      {text}
    </Box>
  )
}
