import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tree } from "@minoru/react-dnd-treeview";

import { Box } from "@mui/material";
import {DataField} from "./DataField";
import { styled } from '@mui/material/styles';

import { setFilterVariant, addNewFilter, setJoinCommand } from "../../../slices/query";
const DropBox = styled(Box)(({theme}) => ({
  '& ul': {
    listStyleType: 'none',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: 0
  }
}));

const Dropzone = ({ index, value }) => {
  let initTree = [];
  value.length===0 ? initTree = [{ parent: 0, id: 'none', text: '', data: {}}] : initTree = value;
  
  const [treeData, setTreeData] = useState(initTree);
  const filterFields = useSelector(state => state.query.filterFields);
  const joinCommand = useSelector(state => state.query.joinCommand);
  const dispatch = useDispatch();

  const handleDrop = (newTree) => {
    const validTree = newTree.filter(({ id }) => id !== 'none' && id !== initTree[0].id)
                             .map(({ id, text, data, droppable }) => ({ id, parent: 0, droppable, text, data }));
    setTreeData(initTree);

    if(validTree.length === 0) return;
    if(validTree[0].data.field === 'none') return;
    let dupCount = 0, id = validTree[0].id;
    filterFields.forEach((item, i) => {
      if(i !== filterFields.length-1 && item.filterVariant[0].id === id)
        dupCount++;
    })
    if(dupCount === 0) {
      dispatch(setFilterVariant({index: index, filterVariant: validTree}));
      if(initTree[0].id === 'none') {
        if(filterFields.length === 1 && joinCommand === "") 
          dispatch(setJoinCommand("{1}"));
        else 
        {
          const newCommand = joinCommand + ` AND {${filterFields.length}}`;
          dispatch(setJoinCommand(newCommand));
        } 
        dispatch(addNewFilter());  
      }
    }
  }

  return (
    <DropBox>
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { depth, isOpen, onToggle }) => (
          <DataField
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

export default Dropzone;