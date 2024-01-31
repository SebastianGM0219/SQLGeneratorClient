import * as React from "react";
import { Typography, Box } from "@mui/material";
import { makeStyles  } from 'tss-react/mui';
import { TypeIcon } from "../../common/Tree/TypeIcon";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 8
    },
    itemStyle: {
      display: 'flex',
      padding: 3,
      border: '1px solid #b6b6b6',
      margin: 4,
      background: 'white',
      minHeight: 32
    },
    labelGridItem: {
      paddingInlineStart: 8
    }
  };
})

export const RowNode = (props) => {
  const { classes } = useStyles();
  const { data } = props.node;
  return (
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
  );
};
