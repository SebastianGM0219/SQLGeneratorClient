import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { makeStyles } from 'tss-react/mui';
import dayjs from 'dayjs';
import clsx from 'clsx';
import TuneIcon from '@mui/icons-material/Tune';
import { TypeIcon } from '../TypeSelector/TypeIcon';

import { setCurTab } from '../../../slices/utility';

const useStyles = makeStyles()((theme) => {
  return {
    inputField: {
      '& .MuiInputBase-input': {
        padding: 0,
        minHeight: 32,
        paddingLeft: 8,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 14
      },
      width: '100%'
    },
    buttonStyle: {
      padding: 3,
      border: '1px solid #b4b4b4',
      marginLeft: 4,
      minWidth: 24
    },
    gridStyle: {
      display: 'grid',
      gridTemplateColumns: '1fr auto'
    },
    menuItemStyle: {
      fontSize: 12
    },
    itemHeight: {
      height: 30,
      paddingLeft: 8,
      '& .MuiListItemIcon-root': {
        minWidth: 32,
        justifyContent: 'center'
      },
      '& .MuiListItemText-primary': {
        fontSize: 12
      }
    },
    datePicker: {
      '& .MuiPickersToolbar-root': {
        display: 'none'
      },
      '& .MuiDateCalendar-root': {
        width: 180,
        maxHeight: 220
      },
      '& .MuiPickersCalendarHeader-label': {
        fontSize: 12
      },
      '& .MuiPickersCalendarHeader-root': {
        paddingLeft: 8,
        paddingRight: 8,
        marginTop: 8,
        marginBottom: 4
      },
      '& .MuiPickersDay-root': {
        height: 22
      },
      '& .MuiPickersDay-hiddenDaySpacingFiller': {
        height: 22
      },
      '& .MuiSvgIcon-root': {
        width: 20,
        height: 20
      },
      '& .MuiIconButton-root': {
        width: 20,
        height: 20
      },
      '& .MuiPickersSlideTransition-root': {
        minHeight: 150
      },
      '& .MuiDialogActions-root>.MuiButtonBase-root': {
        fontSize: 12
      },
      '& .MuiYearCalendar-root': {
        width: 180,
        maxHeight: 180
      },
      '& .MuiPickersYear-yearButton': {
        fontSize: 12,
        width: 36,
        height: 24
      }
    },
    customBox: {
      position: 'relative', 
      filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.32))',
    },
    menuDate: {
      overflow: 'visible',
      position: 'absolute', 
      width: 200, 
      minWidth: 180, 
      top: 40,
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 8,
        width: 10,
        height: 10,
        backgroundColor: '#fff',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    }
  }
});

export default function ParameterEditor({type, data, onSelectParamter, isDisable}) {
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const datePickerRef = React.useRef(null);
  const textFieldRef = React.useRef(null);

  let inititialValue='';
  if(data) inititialValue = data;
  else{
    if(type === 'Date') inititialValue = new Date().toLocaleDateString();
  }
  const [ value, setValue ] = React.useState(inititialValue);
  const [disabled, setDisabled] = React.useState(isDisable);

  const dispatch = useDispatch();
  const parameters = useSelector(state => state.utility.parameters);

  React.useEffect(() => {
    if(type === 'Date'){
      const curDate = new Date().toLocaleDateString();
      setValue(curDate);
    }
    else if(type === 'Number') setValue('0')
    else {
      setValue(data);
    }

  }, [type, data])

  React.useEffect(() => {
    setDisabled(isDisable);
  }, [isDisable]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  }

  const handleChange = (e) => {
    setValue(e.target.value);
    onSelectParamter(e.target.value, false);
  }
  
  const handleClose = (e) => {
    if(e.target.value === 1) {
      dispatch(setCurTab(2))
    }
    else if(e.target.value ===2) {

    }
    setAnchorEl(null);
  }

  const handleParameter = (value) => {
    setValue(value);
    setDisabled(true);
    onSelectParamter(value, true);
  }

  const handleFocus = (e) => {
    setOpenDatePicker(true);
  }

  const handleBlur = (e) => {
    setTimeout(() => {
      if (!datePickerRef.current) {
        setOpenDatePicker(false);
      }
    }, 0);
  }

  const handleCloseDatePicker = (e) => {
    setOpenDatePicker(false);
  }

  const handleDatePickerClick = (e) => {
    textFieldRef.current.focus();
  }

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        textFieldRef.current &&
        !textFieldRef.current.contains(event.target)
      ) {
        setOpenDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const parameterItems = React.useMemo(() => {
    const parameterList = parameters.map(parameter => ( <MenuItem className={classes.itemHeight} key={parameter.name} onClick={() => handleParameter(parameter.name)} value={parameter.name}>
          <ListItemIcon><TypeIcon type={parameter.type} /></ListItemIcon>
          <ListItemText>{parameter.name}</ListItemText>
        </MenuItem>)
      )
      return parameterList
  }, [parameters]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={classes.gridStyle}>
        <Box className={classes.customBox}>
          <TextField 
            ref={textFieldRef}
            onBlur={handleBlur} 
            onFocus={handleFocus} 
            className={classes.inputField} 
            value={value} 
            onChange={handleChange}
            variant='outlined' 
            name="parameter"
            disabled={disabled}
          />
          {/* {openDatePicker && type==='Date' && 
            <Box onClick={handleDatePickerClick} ref={datePickerRef}>
              <StaticDatePicker 
                className={clsx(classes.datePicker, classes.menuDate)}  
                onClose={handleCloseDatePicker} 
                defaultValue={dayjs('2022-04-17')} 
              />
            </Box>
          } */}
        </Box>
        <Button 
          className={classes.buttonStyle}
          onClick={handleClick}
          disabled={disabled}
        >
          <TuneIcon/>
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="parameter-type-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.32))',            
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
              '& .MuiList-root': {
                paddingTop: 0.5,
                paddingBottom: 0.5
              }
            }
          }}
          transformOrigin={{ 
            horizontal: 'right', 
            vertical: 'top'
          }}
          anchorOrigin={{ 
            horizontal: 'right', 
            vertical: 'bottom' 
          }}
        >
          {parameterItems}
          <MenuItem 
            className={classes.menuItemStyle} 
            value="1"
          >
            Create New Parameter
          </MenuItem>
          <MenuItem 
            className={classes.menuItemStyle} 
            value="2"
          >
            Select Global Parameter
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  )
}