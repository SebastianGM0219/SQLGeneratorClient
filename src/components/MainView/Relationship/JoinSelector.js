import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { styled } from '@mui/material/styles';

import { setJoinType } from '../../../slices/query'
const DropSelect = styled(Select)(({theme}) => ({
  '& .MuiSelect-select': {
    display: 'flex',
    padding: 0,
    paddingLeft: 12,
    fontSize: 14
  },
  '& .MuiSelect-select>.MuiListItemIcon-root': {
    alignItems: 'center',
    minWidth: 24,
    marginLeft: 12
  },
  minHeight: 32,
  minWidth: 120,
  marginTop: 8
}));

const useStyles = makeStyles()((theme) => {
  return {
    fontStyle: {
      fontSize: 14
    },
  };
});

export default function JoinSelector({index}) {
  const { classes } = useStyles();
  const join_operator = useSelector(state => state.query.relationFields[index].joinType);
  const [operator, setOperator] = React.useState(join_operator);
  const dispatch = useDispatch();

  const handleChangeOperator = (event, index) => {
    setOperator(event.target.value);
    dispatch(setJoinType({index, value: event.target.value}));
  }

  return (
    <DropSelect
      key = {index}
      value={operator}
      onChange={(e) => handleChangeOperator(e, index)}
      disabled={operator === ''? true: false}
    >
      <MenuItem className={classes.fontStyle} value={0}>LEFT JOIN</MenuItem>
      <MenuItem className={classes.fontStyle} value={1}>RIGHT JOIN</MenuItem>
      <MenuItem className={classes.fontStyle} value={2}>INNER JOIN</MenuItem>
      <MenuItem className={classes.fontStyle} value={3}>FULL JOIN</MenuItem>
    </DropSelect>
  )
}