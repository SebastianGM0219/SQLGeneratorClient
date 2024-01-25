import * as React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      marginTop: 24,
      marginBottom: 8
    },
    fontStyle: {
      fontWeight: 600,
      fontSize: 12,
      marginLeft: 2
    }
  }
});

export default function HeaderText() {
  const {classes} = useStyles();

  return (
    <Box className={classes.boxStyle}>
      <Grid container>
        <Grid item xs={4}>
          <Typography className={classes.fontStyle}>HEADER</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.fontStyle}>SOURCE</Typography>
          
        </Grid>
        <Grid item xs={4}>
          <Typography className={classes.fontStyle}>SOURCE COLUMN</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
