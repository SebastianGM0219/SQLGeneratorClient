import * as React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';

import { makeStyles } from 'tss-react/mui'

import FilterVariant from './FilterVariant'
import FilterOperator from './FilterOperator';
import FilterValue from './FilterValue';

const useStyles = makeStyles()((theme) => {
  return {
    smFont: {
      fontSize: 11,
      fontFamily: 'monospace',
      fontStyle: 'italic'
    },
    startIcon: {
      width: 16,
      height: 16,
      padding: 8,
      color: '#1976D2'
    },
    indexBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 32,
      height: 32
    }
  }
});
export default function FilterDropBox(){
  const { classes } = useStyles();
  const filterFields = useSelector(state => state.query.filterFields);

  return (
    <Box>
      {
        filterFields.map((item, index) => {
          let key = index !== filterFields.length-1?item.filterVariant[0].id : 'filterFields-0';
          const disabled = index !== filterFields.length-1? false : true;
          return (
            <Box key={key} sx={{display: 'flex', width: '100%', mt: 1}}> 
              <Box className={classes.indexBox}>
                <Typography>{index+1}</Typography>
              </Box>
              <Box sx={{width: '100%'}}>
                <Grid spacing={1} container>
                  <Grid item xs={5}>
                    <FilterVariant index={index} value={item.filterVariant} />
                  </Grid>
                  <Grid item xs={2}>
                    <FilterOperator index={index} value={item.operator} type={item.type} disabled={disabled} />
                  </Grid>
                  <Grid item xs={5}>
                    <FilterValue index={index} value={item.filterValue} type={item.type} disabled={disabled} />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          );
        })
      }
    </Box>
  );
}
