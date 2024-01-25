import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tree } from "@minoru/react-dnd-treeview";

import { Box } from "@mui/material";
import DataField from "./DataField";
import { styled } from '@mui/material/styles';
import { addField, setRelationData } from "../../../slices/query";

const DropBox = styled(Box)(({theme}) => ({
  '& ul': {
    listStyleType: 'none',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: 0
  },
}));

const Dropzone = React.memo(({index, type, tables, fields, header_name,columnId}) => {
  const initTree = [{
    parent: 0,
    id: 'none',
    text: 'none',
    data: {
      table: tables,
      field: fields,
      index: index,
      type: type,
      header_name: header_name,
      columnId: columnId
    }
  }];
  const [treeData, setTreeData] = useState(initTree);
  const dispatch = useDispatch();
  const data = useSelector(state => state.query.relationFields);

  React.useEffect(() => {
    setTreeData(initTree);
  }, [fields]);

  const isValidTable = (ind, table) => {
    const tableArray = [...data[data.length - 1].LTable, ...data[data.length - 1].RTable];
    // data.map((item, i) => {
    //   if(i === 0) tableArray.push(item.LTable[0]);
    //   if(i < ind) tableArray.push(item.RTable[0]);
    // });
    if(tableArray.includes(table)) return false;
    return true;
  }
  
//   const handleDrop = (newTree) => {
//     const newArray = newTree.map( item => {
//       if(item.id !== treeData[0].id){
//         let prevField = [...treeData[0].data.field];
//         const {text, id, data} = item;

//         /*
//           prevField.shift();
//             prevField.unshift(data.table+'.'+data.field);
// */
//  //         if(treeData[0].data.table===data.table)

//             prevField.unshift(data.table+'.'+data.field);
// //        prevField.shift();


//         const embedData = {
//           table: [data.table],
//           field: prevField,
//           index: index, 
//           type: type
//         }
//         return {parent:0, text, id, data: embedData};
//       }
//     })


   
//     const realTree = newArray.filter(item => item !== undefined);
//     // if(isValidTable(index, realTree[0].data.table[0]) && realTree.length === 1) {

//       setTreeData(realTree);
//       const table = realTree[0].data.table;
//       const field = realTree[0].data.field;
//       dispatch(addField(index));

//       dispatch(setRelationData({index, type, table, field}))
 
//       // }
//   }

//   const isValidTable = (ind, table) => {
//     const tableArray = [...data[data.length - 1].LTable, ...data[data.length - 1].RTable];
//     // data.map((item, i) => {
//     //   if(i === 0) tableArray.push(item.LTable[0]);
//     //   if(i < ind) tableArray.push(item.RTable[0]);
//     // });
//     if(tableArray.includes(table)) return false;
//     return true;
//   }
  
  const handleDrop = (newTree) => {
    const newArray = newTree.map( item => {
      if(item.id !== treeData[0].id){
        let prevField = [...treeData[0].data.field];
        const {text, id, data} = item;

        prevField.shift();
        prevField.unshift(data.table+'.'+data.field);

        const embedData = {
          table: [data.table],
          field: prevField,
          index: index, 
          type: type
        }
        return {parent:0, text, id, data: embedData};
      }
    })
    const realTree = newArray.filter(item => item !== undefined);
    // if(isValidTable(index, realTree[0].data.table[0]) && realTree.length === 1) {
      setTreeData(realTree);
      const table = realTree[0].data.table;
      const field = realTree[0].data.field;
      dispatch(setRelationData({index, type, table, field}))
    }
  // }

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
        canDrop={() => { return index===0 || type==="right"}}
      />
    </DropBox>
  );
});

export default Dropzone;