import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Dropzone from './Dropzone';
import { makeStyles } from 'tss-react/mui';

import SelectOperator from './SelectOperator';
import JoinSelector from './JoinSelector';

import { addField, removeField, setJoinType,removeJoinRelation } from '../../../slices/query'
import TableService from '../../../services/TableService'
import { addRelation, setRelationData } from "../../../slices/query"


const useStyles = makeStyles()((theme) => {
  return {
    fontStyle: {
      fontSize: 14
    },
    headerStyle: {
      marginTop: 12,
      textAlign: 'center'
    },
    eventItem: {
      padding: 4,
      marginTop: 8
    },
    iconStyle: {
      width: 12,
      height: 12
    },
    btnStyle: {
      padding: 0,
      textTransform: 'none'
    }
  };
});

export default function DropComponent() {
  const { classes } = useStyles();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();

  const relations = useSelector(state => state.query.relationFields);


  
  const handleClick = (event, index) => {
//    if(validateLastFields(index)) 

      dispatch(addField(index));
  }

  const handleRemove = (event, i, index) => {
    dispatch(removeField({index, i}));
  }
  const handleJoinRemove = (event, i, index) => {
    dispatch(removeJoinRelation({index, i}));
  }
  
  const validateLastFields = (index) => {
    const relation = relations[index];
    const fieldLength = relation.LFields.length;
    return relation.LFields[fieldLength-1]!=="" && relation.RFields[fieldLength-1]!==""
  }

  return (
    <Box>
      {
        relations.map((relation, index) => (
          <Grid key={index} container>
            <Grid item xs={1}>
              <Typography className={classes.headerStyle}>JOIN {index+1}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Dropzone index={index} type="left" tables={relation.LTable} fields={relation.LFields} />
            </Grid>
            <Grid item xs={3} sx={{textAlign:'center'}}>
              <JoinSelector index={index} />
              {
                relation.Operator.map((operator, i) => (
                  <SelectOperator key={i} relationIndex={index} fieldIndex={i} />
                ))
              }
            </Grid>
            <Grid item xs={3}>
              <Dropzone index={index} type="right" tables={relation.RTable} fields={relation.RFields}/>
            </Grid>
            <Grid item xs={2}>
              <ul style={{ listStyleType: "none" }}>
                <li className={classes.eventItem}>
                  <Box sx={{height: 24}}>
                    {0 != relation.RTable.length  && <CloseIcon className={classes.iconStyle} onClick={(event) => handleJoinRemove(event, index)}/>}
                  </Box>
                </li>
                {
                  relation.RFields.map((item, i) => (
                    <li key={i}  className={classes.eventItem}>
                      {i != relation.RFields.length - 1 && <CloseIcon className={classes.iconStyle} onClick={(event) => handleRemove(event, i, index)}/>}
                      {i == relation.RFields.length - 1 && (
                      <>
                        <Button className={classes.btnStyle} onClick={(event) => handleClick(event, index)}>Add Field</Button>          
                        <CloseIcon className={classes.iconStyle} onClick={(event) => handleRemove(event, i, index)}/>
                      </>
                      )}                      
                    </li>
                  ))
                }
              </ul>
            </Grid>
          </Grid>
        ))
      }
      
    </Box>
  );
};
