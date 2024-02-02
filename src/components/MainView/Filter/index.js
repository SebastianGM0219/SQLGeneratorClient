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
    <Box sx={{height:"100%"}}>
      <Box className={classes.boxMarginTop}>
        <OperatorEditor/>
      </Box>
      <Box className={classes.boxMarginTop} sx={{overflowY: 'auto', height: '91%'}}>
        <FilterDropBox/>
      </Box>
    </Box>
  )
}