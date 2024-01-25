import React from "react";
import { useDispatch } from "react-redux";
import { Typography, Grid, Box, Select, MenuItem } from "@mui/material";
import { makeStyles  } from 'tss-react/mui';
import { TypeIcon } from "../../common/Tree/TypeIcon";
import { setOperatorType } from "../../../slices/query";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      display: 'flex',
      alignItems: 'center'
    },
    itemStyle: {
      padding: 3,
      paddingLeft: 8,
      border: '1px solid #b6b6b6',
      marginBottom: 4,
      background: 'white',
      '&:hover': {
        border: '1px solid #508dc9'
      }
    },
    paddingText: {
      paddingLeft: 4
    },
    labelGridItem: {
      paddingInlineStart: 8
    },    
    borderedBox: {
      backgroundColor: '#eeeeee',
      border: '1px #666666',
      borderStyle: 'dashed',
      borderRadius: 4,
      padding: 6,
      marginBottom: 4
    },
    tempDropString: {
      textAlign: 'center',
      fontSize: 12
    },
    blockStyle: {
      display: 'block',
      position: 'relative'
    },
    noneStyle: {
      display: 'none'
    },
    closePosition: {
      position: "absolute",
      right: 4
    },
    iconStyle: {
      width: 12,
      height: 12
    },
    selectStyle: {
      fontSize: 12,
      width: 120,
      borderRadius: 0,
      '& .MuiSelect-select': {
        padding: '4px 8px',
      }
    },
    menuItemStyle: {
      fontSize: 12,
      padding: '4px 8px'
    }
  };
})

export const ValueNode = (props) => {
  const { classes } = useStyles();
  const { data, id } = props.node;
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const changed = event.target.value;
    dispatch(setOperatorType({changed}));
  }

  return (
    <Box>
      { id === 'none' && 
        <Box className={classes.borderedBox}>
          <Typography className={classes.tempDropString}>Drop column to filter query results by</Typography>
        </Box>
      }
      {
        id !== 'none' &&
        <Box className={classes.itemStyle}>
          <Grid container>
            {/* <Grid item xs={6}>
              <Box className={classes.boxStyle}>
                <Box> 
                  <TypeIcon droppable={false} type={data?.hasKey?'List':'Table'} />
                </Box>
                <Box className={classes.labelGridItem}>
                  <Typography variant="body2">{`${data.table}`}</Typography>
                </Box>        
              </Box>
            </Grid> */}
            <Grid item xs={6}>
              <Box className={classes.boxStyle}>
                <Box>
                  <TypeIcon droppable={false} type={data?.type} />
                </Box>
                <Box className={classes.labelGridItem}>
                  <Typography variant="body2">{`${props.node.text}`}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Select
                  defaultValue={"sum"}
                  variant="outlined"
                  className={classes.selectStyle}
                  onChange={handleChange}
                >
                  <MenuItem value={"sum"} className={classes.menuItemStyle}>SUM</MenuItem>
                  <MenuItem value={"count"} className={classes.menuItemStyle}>COUNT</MenuItem>
                  <MenuItem value={"avg"} className={classes.menuItemStyle}>AVG</MenuItem>
                </Select>
              </Box>
            </Grid>
          </Grid>
        </Box>
      }
    </Box>
  );
};
