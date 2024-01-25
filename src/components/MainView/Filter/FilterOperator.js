import * as React from 'react'
import { useDispatch } from 'react-redux';
import { Select, MenuItem } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { styled } from '@mui/material/styles';

import { setFilterOperator } from '../../../slices/query';

const DropSelect = styled(Select)(({theme}) => ({
  '& .MuiSelect-select': {
    display: 'flex',
    padding: 0,
    paddingLeft: 8,
    fontSize: 12
  },
  '& .MuiSvgIcon-root': {
    right: 2
  },
  minHeight: 32,
  width: '100%'
}));

const useStyles = makeStyles()((theme) => {
  return {
    fontStyle: {
      fontSize: 14
    },
  };
});

const menus = [
  ['Equal To', 'Not Equal To', 'Like', 'Not Like'],
  ['=', '!=', '>', '>=', '<', '<=']
]

export default function FilterOperator({index, type, value, disabled}) {
  const { classes } = useStyles();
  const initialState = value === -1 ? 0 : value;
  const [operator, setOperator] = React.useState(initialState);
  const menu = type==='Text' || type===''? menus[0]:menus[1];
  const dispatch = useDispatch();

  const handleChangeOperator = (event) => {
    setOperator(event.target.value);
    dispatch(setFilterOperator({index: index, value: event.target.value}));
  }

  return (
    <DropSelect
      value={operator}
      onChange={(e) => handleChangeOperator(e)}
      disabled={disabled}
    >
      {
        menu.map((item, i) => (<MenuItem key={i} className={classes.fontStyle} value={i}>{item}</MenuItem>))
      }
    </DropSelect>
  )
}