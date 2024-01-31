import React from "react";
// import { useDispatch } from "react-redux";
import { useSelector, useDispatch } from 'react-redux';

import { Typography, Grid, Box } from "@mui/material";
import { makeStyles  } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      display: 'flex',
      alignItems: 'center'
    },
    itemStyle: {
      padding: 2,
      border: '1px solid #b6b6b6',
      borderRadius: 4,
      marginBottom: 4,
      background: 'white',
      position: 'relative',
      '&:hover': {
        border: '1px solid #508dc9'
      }
    },
    itemSelectStyle:{
      padding: 2,
      marginBottom: 4,
      border: '1px solid #26b6b6',
      borderRadius: 4,
      margin: 4,
      background: 'white',
      position: 'relative',
      border: '2px solid #508dc9'
    },
    blockStyle: {
      display: 'block',
      position: 'relative',
    },
    noneStyle: {
      display: 'none'
    },
    closePosition: {
      position: "absolute",
      right: 4
    },
    agreePosition: {
      position: "absolute",
      right: 25
    },

    paddingText: {
      paddingLeft: 4
    },
    iconStyle: {
      width: 12,
      height: 12
    },
    sigmaStyle: {
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      fontWeight: 'bold' ,
      width: 20,
      height: 16
    },
    labelGridItem: {
      paddingInlineStart: 8
    },
    fontSigma: {
      paddingTop: 3,
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      fontWeight: 'bold'    
    },
    fontSigma1: {
      paddingBottom: 13,      
      fontFamily: 'Segoe UI',
      fontSize: '13px',
      fontWeight: 'bold'    
    }
  };
})

export const CustomLeftNode = (props) =>{
  const [visible, setVisible] = React.useState(false);

  const {data, id,text} = props.node;
  const indent = props.depth * 24;
  const { classes } = useStyles();
  const showCloseButton = (e) => {
    setVisible(true);
  }

  const hideCloseButton = (e) => {
    setVisible(false);
  }
  const handleClick = (e) => {
   // dispatch(removeSelector({id}));
  }
  return (
    <Box sx= {{paddingInlineStart: indent}} className={ classes.itemStyle}  onMouseOver={showCloseButton} onMouseOut = {hideCloseButton}>
      {/* <Box className={visible?classes.blockStyle: classes.noneStyle}>
        <Box className={classes.closePosition}>
          <CloseIcon className={classes.iconStyle} onClick={handleClick}/>
        </Box>
      </Box> */}
      
      <Grid container>
        <Grid item xs={4}  className={classes.boxStyle}>
          <Typography variant="body2" className={classes.paddingText} >{text}</Typography>
        </Grid>     
      </Grid>
  </Box>

  );
}