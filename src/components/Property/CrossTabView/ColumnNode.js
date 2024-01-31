import * as React from "react";
import { Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { makeStyles  } from 'tss-react/mui';
import { TypeIcon } from "../../common/Tree/TypeIcon";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      paddingLeft: 8,
      paddingRight: 8
    },
    itemStyle: {
      padding: 2,
      border: '1px solid #b6b6b6',
      margin: 4,
      background: 'white',
      minHeight: 32
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
      padding: 3,
      margin: 4,
      minHeight: 32
    },
    toggleButton: {
      padding: 4
    }
  };
})

export const ColumnNode = (props) => {
  const { classes } = useStyles();
  const { id, data } = props.node;
  return (
    <Box>
      { id === 'none' &&
        <Box className={classes.borderedBox}>
          <Typography sx={{textAlign:'center'}}>Drag a field here to sort.</Typography>
        </Box>
      }
      { id !== 'none' &&    
        <Box className={classes.itemStyle}>
          <Box className={classes.boxStyle}>
            <Box>
              <TypeIcon droppable={false} type={data?.type} />
            </Box>
            <Box className={classes.labelGridItem}>
              <Typography variant="body2">{`${props.node.text}`}</Typography>
            </Box>
          </Box>
        </Box>
      }
    </Box>
  );
};
