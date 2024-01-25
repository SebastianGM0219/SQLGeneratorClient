import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Tree } from "@minoru/react-dnd-treeview";
import { ColumnNode } from "./ColumnNode";
import { theme } from "./theme";
import { styled } from '@mui/material/styles';

import { makeStyles  } from 'tss-react/mui';
import { useDispatch, useSelector } from "react-redux";
import { setColumnData } from "../../../slices/query";
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

  const columnFields = useSelector(state => state.query.crosstabColumnFields);
  const { classes } = useStyles();
  const [treeData, setTreeData] = useState(columnFields);

  const handleDrop = (newTree) => {

    const filtered = newTree.map(node => {
      if (node.id !== 'none'){
        const { parent, id, text, data } = node;
        const {field, hasKey, isKey, table, type} = data;

        // if (sortType !== undefined) 
        //   return { parent, id, text, data }
        return {parent, id, text, data: {field, hasKey, isKey, table, type}}
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
      dispatch(setColumnData(realTree))
      setTreeData(realTree)  
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DropBox>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <ColumnNode
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