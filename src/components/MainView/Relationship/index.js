import * as React from 'react'
import { useSelector, useDispatch } from "react-redux";
import DropComponent from './DropComponent'
import { Button, Box } from '@mui/material'
import { addRelation } from '../../../slices/query';
export default function RelationShip() {
  const relations = useSelector(state => state.query.relationFields);
  const lastRelation = relations[relations.length-1];
  const dispatch = useDispatch();

  const handleClickAdd = (event) => {
//     if(validateLastRelation())
      dispatch(addRelation());
  }
  
  const validateLastRelation = () => {
    const { LTable, LFields, RTable, RFields } = lastRelation;
    return LTable.length && LFields.length && RTable.length && RFields.length;
  }

  return (
    <Box>
      <DropComponent />
      <Button onClick={(handleClickAdd)}>Add RelationShip</Button>
    </Box>
  )
}