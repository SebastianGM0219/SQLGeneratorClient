import * as React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import UnsortedView from './UnsortedView'
import SortedView from './SortedView'

import { makeStyles  } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => {
  return {
    textStyle: {
      textAlign: 'center',
      padding: 16,
      fontSize: 14
    }
  };
})

export default function SortView() {
  const { classes } = useStyles();
  return (
    <Box sx={{height: '100%'}}>
      <Grid spacing={4} container sx={{height: '100%'}}>
        <Grid item xs={6} sx={{height: '100%'}}>
          <Typography className={classes.textStyle}>Unsorted</Typography>
          <UnsortedView sx={{ height: '91%'}}/>
        </Grid>
        <Grid item xs={6} sx={{height: '100%'}}>
          <Typography className={classes.textStyle}>Sorted</Typography>
          <SortedView sx={{ height: '91%'}}/>
        </Grid>
      </Grid>
    </Box>
  )
}