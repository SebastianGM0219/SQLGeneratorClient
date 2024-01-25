import React from "react";
// import { useDispatch } from "react-redux";
import { useSelector, useDispatch } from 'react-redux';

import { Typography, Grid, Box } from "@mui/material";
import { makeStyles  } from 'tss-react/mui';
import { TypeIcon } from "../../common/Tree/TypeIcon";
import CloseIcon from '@mui/icons-material/Close';
import { removeSelector } from "../../../slices/query";
import { clickSelector } from "../../../slices/query";
import Functions from '@mui/icons-material/Functions';
import { setCurTab } from '../../../slices/utility';
import TableService from '../../../services/TableService'
import { addRelation, setRelationData,initRelation} from "../../../slices/query"
import { array } from "prop-types";

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
      margin: 4,
      background: 'white',
      position: 'relative',
      '&:hover': {
        border: '1px solid #508dc9'
      }
    },
    itemSelectStyle:{
      padding: 2,
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
export const SelectorNode = (props) => {
  const { classes } = useStyles();
  const {isSelected} = props;
  const { data, id } = props.node;
 
  const indent = props.depth * 24;
  const [visible, setVisible] = React.useState(false);
  const dispatch = useDispatch();
  const showCloseButton = (e) => {
    setVisible(true);
  }

  const hideCloseButton = (e) => {
    setVisible(false);
  }
  
  const handleClick = (e) => {
    dispatch(removeSelector({id}));
  }
  
  const handleProperty = (e) => {
    dispatch(setCurTab(1));
    dispatch(clickSelector({id}));    
  }


  return (
    <Box sx= {{paddingInlineStart: indent}} className={isSelected?classes.itemSelectStyle: classes.itemStyle} onClick={handleProperty} onMouseOver={showCloseButton} onMouseOut = {hideCloseButton}>
      <Box className={visible?classes.blockStyle: classes.noneStyle}>
        <Box className={classes.closePosition}>
          <CloseIcon className={classes.iconStyle} onClick={handleClick}/>
        </Box>
      </Box>
      <Box className={data.aggreType !== "none"?classes.blockStyle: classes.noneStyle}>
        <Box className={classes.agreePosition}>
          <Functions className={data.aggreType === "sum"?classes.sigmaStyle: classes.noneStyle}/>
          {data.aggreType === "avg"&&<p className={data.aggreType === "avg"?classes.fontSigma1: classes.noneStyle}> Avg</p> }
          {data.aggreType === "max"&&<p className={data.aggreType === "max"?classes.fontSigma1: classes.noneStyle}> Max</p> }
          {data.aggreType === "min"&&<p className={data.aggreType === "min"?classes.fontSigma1: classes.noneStyle}> Min</p> }
          {data.aggreType === "count"&&<p className={data.aggreType === "count"?classes.fontSigma1: classes.noneStyle}> N</p> }
        </Box>                                                                                                                                                                                                                                                                                                                                                                                        
      </Box>

      <Grid container>
        <Grid item xs={4}  className={classes.boxStyle}>
          <Typography variant="body2" className={classes.paddingText} >{`${data.header_name.toUpperCase()}`}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Box className={classes.boxStyle}>
            <Box> 
              <TypeIcon droppable={false} type={data?.hasKey?'List':'Table'} />
            </Box>
            <Box className={classes.labelGridItem}>
              <Typography variant="body2">{`${data.table}`}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className={classes.boxStyle}>
            <Box>
              <TypeIcon droppable={false} type={data?.type} />
            </Box>
            <Box className={classes.labelGridItem}>
              <Typography variant="body2">{`${data.columnId}`}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
