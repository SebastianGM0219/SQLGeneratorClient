import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Tree } from "@minoru/react-dnd-treeview";
import { RowNode } from "./RowNode";
import { theme } from "./theme";
import { makeStyles  } from 'tss-react/mui';
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";

import { setCrossTabSelector } from "../../../slices/query";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      height: 'calc(100% - 20px)',
    },
    treeRoot: {
      height: '100%'
    },
    placeholderContainer: {
      position: 'relative'
    }
  };
})

export default function RowView() {
  const selectFields = useSelector(state => state.query.selectFields);
  const columnFields = useSelector(state => state.query.crosstabColumnFields);
  const valueFields =  useSelector(state => state.query.crosstabValueFields);

  const dispatch = useDispatch();

  const unsortedFields = selectFields.filter(item => {
    let count = 0;
    columnFields.forEach(sorted => {
      if(item.id !== sorted.id) count++;
    })
    if(count === columnFields.length  && valueFields[0].id !== item.id) return item;
  });

  const { classes } = useStyles();
  const [treeData, setTreeData] = useState(unsortedFields);

  React.useEffect(() => {
    const fields = selectFields.filter(item => {
      let count = 0;
      columnFields.forEach(sorted => {
        if(item.id !== sorted.id) count++;
      })
      if(count === columnFields.length  && valueFields[0].id !== item.id) return item;
    });
    setTreeData(fields)
    dispatch(setCrossTabSelector(fields));
  }, [selectFields, columnFields,valueFields])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={classes.boxStyle}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <RowNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          )}
          classes={clsx(classes.treeRoot, classes.placeholderContainer)}
          sort={false}
          insertDroppableFirst={false}
          canDrop={() => { return false; } }
          dropTargetOffset={5}
        />
      </Box>
    </ThemeProvider>
  );
}