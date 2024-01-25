import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tree } from "@minoru/react-dnd-treeview";

import { Box } from "@mui/material";
import {DataField} from "./DataField";
import { styled } from '@mui/material/styles';
import {setFieldCalcDrop, addNewFieldDropCalc,setFilterVariant, addNewFilter, setJoinCommand,setSourceColumnSelector} from "../../../slices/query";
const DropBox = styled(Box)(({theme}) => ({
  '& ul': {
    listStyleType: 'none',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: 0
  }
}));

const Dropzone = ({ index, value,handleParentSelect}) => {
  let initTree = [];
  value.length===0 ? initTree = [{ parent: 0, id: 'none', text: '', data: {}}] : initTree = value;
  
  const [treeData, setTreeData] = useState(initTree);
//  const filterFields = useSelector(state => state.query.filterFields);
  const FieldCalcDrop = useSelector(state => state.query.fieldCalcDrop);
  const joinCommand = useSelector(state => state.query.joinCommand);
  const dispatch = useDispatch();

  const handleDrop = (newTree) => {
    

//    dispatch(setSourceColumnSelector({id:newTree[0].id, sourceColumn: newTree[0].data.header_name, source: newTree[0].data.table,field:newTree[0].data.field,type:newTree[0].data.type}));
  

    const validTree = newTree.filter(({ id }) => id !== 'none' && id !== initTree[0].id)
                             .map(({ id, text, data, droppable }) => ({ id, parent: 0, droppable, text, data }));
    setTreeData(initTree);


    if(validTree.length === 0) return;
    if(validTree[0].data.field === 'none'||validTree[0].data.header_name==="Calculation") return;
    let dupCount = 0, id = validTree[0].id;
    FieldCalcDrop.forEach((item, i) => {
      if(i !== FieldCalcDrop.length-1 && item.filterVariant[0].id === id)
        dupCount++;
    })
    if(dupCount === 0) {
      dispatch(setFieldCalcDrop({index: index, FieldCalcDrop: validTree}));
      if(initTree[0].id === 'none') {
        // if(filterFields.length === 1 && joinCommand === "")
        //   dispatch(setJoinCommand("{1}"));
        // else {
        //   const newCommand = joinCommand + ` AND {${filterFields.length}}`;
        //   dispatch(setJoinCommand(newCommand));
        // }
        dispatch(addNewFieldDropCalc()); 
      }
  /*    dispatch(setFilterVariant({index: index, calcDropFields: validTree}));
      
      if(initTree[0].id === 'none') {
        if(filterFields.length === 1 && joinCommand === "")
          dispatch(setJoinCommand("{1}"));
        else {
          const newCommand = joinCommand + ` AND {${filterFields.length}}`;
          dispatch(setJoinCommand(newCommand));
        }
        dispatch(addNewFilter());  
      }*/
    }
  }
  const handleSelect = () => {
    handleParentSelect(index);
  }
  return (
    <DropBox>
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { depth, isOpen, onToggle }) => (
          <DataField
            index={index}
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
            handleParent={handleSelect}
          />
        )}
        sort = {false}
        onDrop={handleDrop}
        canDrag={() => { return true; }}
        // canDrop={() => true}
        canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
//            console.log(dragSource?.parent===0)
            if(dragSource?.parent===0) 
              return false;
          // if (dragSource?.parent === dropTargetId) {
          //   return true;
          // }
        }}
      />
    </DropBox>
  );
}

export default Dropzone;