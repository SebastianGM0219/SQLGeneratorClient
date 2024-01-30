import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, FormControlLabel, Switch, Button } from '@mui/material';
import { makeStyles  } from 'tss-react/mui';

import { TypeIcon } from '../common/Tree/TypeIcon';
import ParameterEditor from '../common/ParameterEditor';
import { setFilterValue } from '../../slices/query';

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
    boxStyle: {
      display: 'flex',
      alignItems: 'center'
    },  
    labelGridItem: {
      paddingInlineStart: 8
    },
    labelFont: {
      fontSize: 14,
      fontWeight: 600,
      color: '#505050'
    },
    gridBox: {
      paddingTop: 4,
      paddingBottom: 4
    },
    defBox: {
      borderTop: '1px solid #eeeeee'
    },
    vSpacing: {
      marginTop: 8,
      marginLeft: -6
    },
  }
});

export default function FilterTab() {
  const { classes } = useStyles();
  const currentColumn = useSelector(state => state.utility.currentColumn);
  const [parameter, setParameter] = React.useState('');
  const [isParameter, setIsParameter] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const filterFields = useSelector(state => state.query.filterFields);
  const parameters = useSelector(state => state.utility.parameters);
  const dispatch = useDispatch();

  const handleParameter = (value, isParam) => {
    setParameter(value);
    setIsParameter(isParam);
    if(currentColumn.source && currentColumn.column && value) {
      setDisabled(false)
    }
    else setDisabled(true)
  }

  const handleApply = (e) => {
    let curIndex = -1;
    filterFields.forEach( (filter, index) => {
      if(index !==filterFields.length-1 && filter.filterVariant[0].data.table === currentColumn.source && filter.filterVariant[0].data.field === currentColumn.column) {
        curIndex = index;
      }
    });
    let defaultValue = "";
    parameters.forEach(parameterItem => {
      if(parameterItem.name === parameter) defaultValue = parameterItem.default;
    });

    if(!isParameter) defaultValue = parameter;

    if(curIndex !== -1) {
      const filterValue = {
        isParam: isParameter,
        default: defaultValue,
        parameter: parameter
      }
      dispatch(setFilterValue({index: curIndex, filterValue}))
    }
  }

  React.useEffect(() => {

  }, [currentColumn])

  return (
    <Box sx={{position: 'relative', height: '100%'}}>
      <Box sx={{ position: 'absolute', bottom: 4, left: 12}}>
        <Button variant='contained' disabled={disabled} onClick={handleApply}>Apply</Button>
      </Box>
      <Box className={classes.headerBox}>
        <Typography className={classes.headerFont}>Filter Propterties</Typography>
      </Box>
      <Box sx={{padding: 1.5}}>
        <Box>
          <Grid className={classes.gridBox} container>
            <Grid item xs={3}>
              <Typography className={classes.labelFont}>Source</Typography>
            </Grid>
            <Grid item xs={9}>
              <Box className={classes.boxStyle}>
                <Box> 
                  <TypeIcon droppable={false} type={'Table'} />
                </Box>
                <Box className={classes.labelGridItem}>
                  <Typography variant="body2">{currentColumn.source}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid className={classes.gridBox} container>
            <Grid item xs={3}>
              <Typography className={classes.labelFont}>Column</Typography>
            </Grid>
            <Grid item xs={9}>
              <Box className={classes.boxStyle}>
                <Box> 
                  <TypeIcon droppable={false} type={'Text'} />
                </Box>
                <Box className={classes.labelGridItem}>
                  <Typography variant="body2">{currentColumn.column}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.defBox}>
          <FormControlLabel className={classes.vSpacing} control={<Switch size='small' />} label="Calculated" />
          <Grid sx={{marginTop: 2}} container>
            <Grid item className={classes.boxStyle} xs={3}>
              <Typography className={classes.labelFont}>Value</Typography>
            </Grid>
            <Grid item xs={9}>
              <Box>
                <ParameterEditor type={currentColumn.data.type} data={currentColumn.data.value} isDisable={currentColumn.data.isParam} onSelectParamter={handleParameter} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}