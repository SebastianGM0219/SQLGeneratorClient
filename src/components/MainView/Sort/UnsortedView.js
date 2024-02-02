import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Tree } from "@minoru/react-dnd-treeview";
import { UnsortedNode } from "./UnsortedNode";
import { theme } from "./theme";
import { makeStyles  } from 'tss-react/mui';
import { useSelector } from "react-redux";
import clsx from "clsx";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      height: 'calc(100% - 20px)',
      overflowY: 'auto',
    },
    treeRoot: {
      height: '100%'
    },
    placeholderContainer: {
      position: 'relative'
    }
  };
})

export default function UnsortedView() {
  const selectFields = useSelector(state => state.query.selectFields);
  const sortFields = useSelector(state => state.query.sortFields);

  const unsortedFields = selectFields.filter(item => {
    let count = 0;
    sortFields.forEach(sorted => {
      if(item.id !== sorted.id) count++;
    })
    if(count === sortFields.length) return item;
  });

  const { classes } = useStyles();
  const [treeData, setTreeData] = useState(unsortedFields);

  React.useEffect(() => {
    const fields = selectFields.filter(item => {
      let count = 0;
      sortFields.forEach(sorted => {
        if(item.id !== sorted.id) count++;
      })
      if(count === sortFields.length) return item;
    });
    setTreeData(fields)
  }, [selectFields, sortFields])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={classes.boxStyle}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <UnsortedNode
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