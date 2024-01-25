import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, FormControlLabel, Switch} from '@mui/material';
import { makeStyles  } from 'tss-react/mui';

import RowView from './CrossTabView/RowView';
import ColumnView from './CrossTabView/ColumnView';
import ValueView from './CrossTabView/ValueView';

import { setCrossTab } from '../../slices/utility';
import { formatCrossFields } from '../../slices/query';

const useStyles = makeStyles()((theme) => {
  return {
    headerBox: {
      padding: 24,
      borderBottom: '1px solid #eeeeee',
    },
    headerFont: {
      fontWeight: 600,
      color: '#0D1F3A'
    },
    typoFont: {
      fontSize: 15,
      fontWeight: 600,
      color: '#424450',
      marginTop: 8
    },
    dependantBox: {
      display: 'flex',
      justifyContent: 'center',
      padding: 32
    },
  }
});

export default function CrossTab() {
  const { classes } = useStyles();
  const [isCrossTab, setIsCrossTab] = React.useState(false);

  const dispatch = useDispatch();

  const handleSwitch = (e) => {
    setIsCrossTab(e.target.checked);
    dispatch(setCrossTab(e.target.checked));
    if(e.target.checked) {
      dispatch(formatCrossFields());
    }
  }

  return (
    <Box>
      <Box className={classes.headerBox}>
        <Typography className={classes.headerFont}>Cross Tab</Typography>
      </Box>
      <Box>
        <Box>
          <FormControlLabel sx={{ml: 0, mt: 0.5, mb: 0.5}} control={<Switch value={isCrossTab} onChange={handleSwitch} />} label='Enable Crosstab'/>
        </Box>
        {
          isCrossTab && (
            <Box sx={{padding: 1}}>
              <Typography>Rows</Typography>
              <RowView/>
              <Typography>Columns</Typography>
              <ColumnView/>
              <Typography>Value</Typography>
              <ValueView/>
            </Box>
          )
        }
        {!isCrossTab && (
            <Box className={classes.dependantBox}>
              <Typography className={classes.notifyFont}>CrossTab disabled</Typography>
            </Box>
        )}
      </Box>
    </Box>
  )
}