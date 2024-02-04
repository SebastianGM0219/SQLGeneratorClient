import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, InputBase, FormControl, Switch, FormControlLabel, Button, Select, MenuItem } from '@mui/material';
import { makeStyles  } from 'tss-react/mui';
import { alpha, styled } from '@mui/material/styles';
import clsx from 'clsx';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TypeSelector from '../common/TypeSelector';
import TextListArea from '../common/TextListArea';

import { createNewParameter } from '../../slices/utility';
import { setCurTab } from '../../slices/utility';

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
    bodyFont: {
      fontSize: 14,
      fontWeight: 400,
      textAlign: 'center',
      margin: 8
    },
    boxPadding: {
      padding: 12
    },
    typoFont: {
      fontSize: 15,
      fontWeight: 600,
      color: '#424450'
    },
    iconBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    labelFont: {
      fontSize: 15,
      color: '#b4b4b4',
    },
    boldFont: {
      fontWeight: 600
    },
    grayColor: {
      color: '#b4b4b4',
      width: 16,
      height: 16
    },
    switchStyle: {
      maringLeft: 8,
      marginTop: 8,
      marginRight: 8
    },
    defaultSelect: {
      width: 120,
      padding: 0,
      '& .MuiSelect-select': {
        padding: 0,
        paddingLeft: 8,
        minHeight: 32
      }
    }
  }
});

const QueryInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(4),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    border: '1px solid',
    borderColor: '#b4b4b4',
    fontSize: 14,
    width: '100%',
    padding: '5px 7px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function ParameterTab() {
  const { classes } = useStyles();
  const [isList, setIsList] = React.useState(false);
  const [parameter, setParameter] = React.useState('');
  const [type, setType] = React.useState('Text');
  const [displayName, setDisplayName] = React.useState('');
  const [defaultValue, setDefaultValue] = React.useState('');
  const [defaultList, setDefaultList] = React.useState('');
  const [defaultListValue, setDefaultListValue] = React.useState('');

  const dispatch = useDispatch();
  const parameters = useSelector(state => state.utility.parameters);

  const handleSwitch = (e) => {
    setIsList(e.target.checked)
  }

  const handleParameter = (e) => {
    setParameter(e.target.value);
  }

  const handleParamterEdited = (e) => {
    const display = parameter.replace(' ', '');
    setDisplayName(display);
  }

  const handleDefaultValue = (e) => {
    setDefaultValue(e.target.value);
  }

  const handleDefaultList = (value) => {
    setDefaultList(value);
  }

  const handleCreate = (e) => {
    let isContained = false;
    parameters.forEach(item => {
      if(item.name === parameter)
        isContained = true;
    })
    if(isList) {    
      const value = defaultList.split('\n');
      const newParameter = {
        name: parameter,
        type: type,
        isList: isList,
        default: isList ? defaultListValue : defaultValue,
        list: value
      };
      if(!isContained) {
        dispatch(createNewParameter({parameter: newParameter}));
        dispatch(setCurTab(1));
      }
    }
    else {
      const value = defaultValue;
      const newParameter = {
        name: parameter,
        type: type,
        isList: isList,
        default: value,
        value: value,
        list: []
      }
      if(!isContained) {
        dispatch(createNewParameter({parameter: newParameter}));
        dispatch(setCurTab(1));
      }
    }
    
  }

  const handleDefaultListValue = (e) => {
    setDefaultListValue(e.target.value)
  }

  const handleTypeChange = (value) => {
    setType(value);
  }

  const menuList = React.useMemo(()=> {
    const list = defaultList.split('\n');
    const menuLists = list.map((item, index) => (item!==""&& <MenuItem key={index} value={item}>{item}</MenuItem>));
    const renderItems = menuLists.filter(item => item !== undefined);
    return renderItems;
  }, [defaultList])

  return (
    <Box sx={{ position: 'relative', height: '100%'}}>
      <Box sx={{position: 'absolute', bottom: 10, right: 12 }}>
        <Button variant='contained' disabled={parameter.length === 0} onClick={handleCreate} >Create</Button>
      </Box>
      <Box className={classes.headerBox}>
        <Typography className={classes.headerFont}>Parameter Properties</Typography>
      </Box>
      <Box className={classes.boxPadding}>
        <Box>
          <Typography className={classes.bodyFont}>Create New Parameter</Typography>
        </Box>
        <Box>
          <FormControl variant="standard" sx={{ width: '100%'}}>
            <Typography className={classes.typoFont}>Name</Typography>
            <QueryInput defaultValue="" id="parameter-name" placeholder='Click to add a name' onChange={handleParameter} onBlur={handleParamterEdited} />
          </FormControl>
        </Box>
        <Box sx={{display: 'flex', paddingTop: 2, paddingBottom: 2}}>
          <Box className={classes.iconBox}>
            <Typography className={clsx(classes.labelFont, classes.boldFont)}>SQL Name</Typography>
            <HelpOutlineIcon className={classes.grayColor}/>
          </Box>
          <Box sx={{paddingLeft: 2}}>
            <Typography className={classes.labelFont}>{displayName}</Typography>
          </Box>
        </Box>
        <Box>
          <Typography className={classes.typoFont}>Type</Typography>
          <TypeSelector value={type} onTypeChange={handleTypeChange} />
        </Box>
        <Box>
          <FormControlLabel sx={{ml: 0, mt: 0.5, mb: 0.5}} control={<Switch size='small' value={isList} onChange={handleSwitch} />} label='Pick List'/>
        </Box>
        <Box>
          {isList ? (
              <Box>
                <TextListArea value={defaultList} label="List Option" hasIcon={true} onChangeList={handleDefaultList} />
                <Select className={classes.defaultSelect} sx={{minHeight: 32}} value={defaultListValue} onChange={handleDefaultListValue} name="value-list" variant='outlined'>
                  {menuList}
                </Select>
              </Box>
            ) : (
              <QueryInput name="parameter-default-value" placeholder='Default Value' value={defaultValue} onChange={handleDefaultValue} />
            )
          }
        </Box>
      </Box>
    </Box>
  )
}