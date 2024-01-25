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
    <Box>
      <Grid spacing={4} container>
        <Grid item xs={6}>
          <Typography className={classes.textStyle}>Unsorted</Typography>
          <UnsortedView/>
        </Grid>
        <Grid item xs={6}>
        <Typography className={classes.textStyle}>Sorted</Typography>
          <SortedView/>
        </Grid>
      </Grid>
    </Box>
  )
}