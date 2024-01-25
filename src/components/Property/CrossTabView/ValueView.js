import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tree } from "@minoru/react-dnd-treeview";

import { Box } from "@mui/material";
import { ValueNode } from "./ValueNode";
import { styled } from '@mui/material/styles';

import { setCrossTabValue } from "../../../slices/query";
const DropBox = styled(Box)(({theme}) => ({
  '& ul': {
    listStyleType: 'none',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: 0
  }
}));

const ValueView = () => {
  let initTree = [];
  const value = useSelector(state => state.query.crosstabValueFields);
  initTree = value;
  
  const [treeData, setTreeData] = useState(initTree);
  const dispatch = useDispatch();

  const handleDrop = (newTree) => {
    const validTree = newTree.filter(({ id }) => id !== 'none' && id !== initTree[0].id)
                             .map(({ id, text, data, droppable }) => ({ id, parent: 0, droppable, text, data }));
    if(validTree.length === 0) return;
    setTreeData(validTree);

    dispatch(setCrossTabValue(validTree));
  }

  return (
    <DropBox>
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { depth, isOpen, onToggle }) => (
          <ValueNode
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        )}
        sort = {false}
        onDrop={handleDrop}
        canDrag={() => { return false; }}
        canDrop={() => { return true; }}
      />
    </DropBox>
  );
}

export default ValueView;