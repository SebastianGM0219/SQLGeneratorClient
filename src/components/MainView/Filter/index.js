import * as React from 'react'
import { Box } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import OperatorEditor from './OperatorEditor'
import FilterDropBox from './FilterDropBox'

const useStyles = makeStyles()((theme) => {
  return {
    boxMarginTop: {
      marginTop: 8
    }
  }
});

export default function FilterView() {
  const { classes } = useStyles();
  return (
    <Box>
      <Box className={classes.boxMarginTop}>
        <OperatorEditor/>
      </Box>
      <Box className={classes.boxMarginTop}>
        <FilterDropBox/>
      </Box>
    </Box>
  )
}