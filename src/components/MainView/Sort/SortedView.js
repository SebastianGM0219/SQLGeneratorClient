import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Tree } from "@minoru/react-dnd-treeview";
import { SortedNode } from "./SortedNode";
import { theme } from "./theme";
import { styled } from '@mui/material/styles';

import { makeStyles  } from 'tss-react/mui';
import { useDispatch, useSelector } from "react-redux";
import { setSortData } from "../../../slices/query";
import clsx from "clsx";

const DropBox = styled(Box)(({theme}) => ({
  '& ul': {
    listStyleType: 'none',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: 0,
    height: '100%'
  },
  height: '100%'

}));
const useStyles = makeStyles()((theme) => {
  return {
    treeRoot: {
      height: '100%'
    },
    placeholderContainer: {
      position: 'relative'
    }
  };
})

export default function SortedView() {
  const dispatch = useDispatch();

  const sortFields = useSelector(state => state.query.sortFields);
  const { classes } = useStyles();
  const [treeData, setTreeData] = useState(sortFields);

  const handleDrop = (newTree) => {

    const filtered = newTree.map(node => {
      if (node.id !== 'none'){
        const { parent, id, text, data } = node;
        const {field, hasKey, isKey, table, type, sortType} = data;

        if (sortType !== undefined) 
          return { parent, id, text, data }
        return {parent, id, text, data: {field, hasKey, isKey, table, type, sortType: 'ASC'}}
      }
    });
    const realTree = filtered.filter(node => node!==undefined);
    realTree.push({
      parent: 0,
      id: 'none',
      text: '',
      data: {}
    })
    if(newTree.length !== treeData.length) {
      dispatch(setSortData(realTree))
      setTreeData(realTree)  
    }
  }

  React.useEffect(() => {
    setTreeData(sortFields);
  }, [sortFields])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DropBox sx={{ height: '95%', overflowY: 'auto'}}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <SortedNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          )}
          classes={clsx(classes.treeRoot, classes.placeholderContainer)}
          sort={false}
          insertDroppableFirst={false}
          onDrop = {handleDrop}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}          
          dropTargetOffset={5}
        />
      </DropBox>

    </ThemeProvider>
  );
}