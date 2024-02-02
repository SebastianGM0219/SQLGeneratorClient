import * as React from 'react'
import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { TypeIcon } from './TypeIcon';

const useStyles = makeStyles()((theme) => {
  return {
    buttonStyle: {
      padding: 3,
      border: '1px solid #b4b4b4',
      minWidth: 24,
      width: 32,
      height: 32,
      borderRadius: '0px 4px 4px 0px',
    },
    gridBox: {
      display: 'grid',
      gridTemplateColumns: '1fr auto'
    },
    menuItemStyle: {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 8,
      paddingRight: 8,
      '& .MuiListItemText-primary': {
        fontSize: 12
      }
    }
  }
});

const items = ['Text', 'Integer', 'Decimal', 'Boolean', 'TimeStamp', 'Date'];

export default function TypeButton({iconType, onChangeType, disabled}){
  const { classes } = useStyles();
 
  const [type, setType] = React.useState(iconType);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(()=>{
    setType(iconType);
  },[iconType])
  
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  }

  const handleClose = (e) => {
    setAnchorEl(null);
  }

  const handleChange = (e, value) => {
    setType(value);
    onChangeType(value);
  } 

  return (
    <Box>
      <Button 
        className={classes.buttonStyle}
        disabled={disabled}
        onClick={handleClick}
      >
        <TypeIcon type={type}/>
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
            mt: 1,
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
      {
        items.map(item =>(
          <MenuItem key={item} className={classes.menuItemStyle} value={item} onClick={(e) => handleChange(e, item)}>
            <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
              <TypeIcon type={item} className={classes.fontStyle} />
            </ListItemIcon>
            <ListItemText primary={item} className={classes.fontStyle} />
          </MenuItem>
        ))
      }
      </Menu>
    </Box>
  )
}