import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { styled } from '@mui/material/styles';
import { setOperator as setOperators } from '../../../slices/query'

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

export default function SelectOperator({relationIndex, fieldIndex}) {
  const { classes } = useStyles();
  const relation_operator = useSelector(state => state.query.relationFields[relationIndex].Operator[fieldIndex]);
  const [operator, setOperator] = React.useState(relation_operator);
  const dispatch = useDispatch();

  const handleChangeOperator = (event, relationIndex, fieldIndex) => {
    setOperator(event.target.value);
    dispatch(setOperators({relationIndex, fieldIndex, operator: event.target.value}));
  }

  return (
    <DropSelect
      key = {relationIndex+'-'+fieldIndex}
      value={operator}
      onChange={(e) => handleChangeOperator(e, relationIndex, fieldIndex)}
      disabled={operator === ''? true: false}
    >
      <MenuItem className={classes.fontStyle} value={0}>{'='}</MenuItem>
      <MenuItem className={classes.fontStyle} value={1}>{'!='}</MenuItem>
      <MenuItem className={classes.fontStyle} value={2}>{'>'}</MenuItem>
      <MenuItem className={classes.fontStyle} value={3}>{'>='}</MenuItem>
      <MenuItem className={classes.fontStyle} value={4}>{'<'}</MenuItem>
      <MenuItem className={classes.fontStyle} value={5}>{'<='}</MenuItem>
    </DropSelect>
  )
}