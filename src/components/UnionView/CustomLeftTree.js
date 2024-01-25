import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {Box} from "@mui/material";
import { CustomLeftNode } from "./CustomLeftNode";
import { Tree } from "@minoru/react-dnd-treeview";
import { makeStyles  } from 'tss-react/mui';
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import {  setLeftUnionData1 } from "../../slices/union";
import styles from "./App.module.css";
const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      backgroundColor: '#eeeeee',
      // height: 'calc(100% - 20px)',
      height: '100%',
      // borderRadius: 4,
      // border: '1px solid #666666',
      padding: '7px',
      borderRight: 'none'
      // borderStyle: 'dashed'
    },
    treeRoot: {
      height: '100%'
    },
    placeholderContainer: {
      position: 'relative'
    }
  };
})


export default function CustomLeftTree(props) {
  const { classes } = useStyles();

  const queryData = useSelector(state => state.union.leftTree);
  console.log("leftTree");
  console.log(queryData);
  const dispatch = useDispatch();
//  const [treeData, setTreeData] = useState(queryData);
  const handleDrop = (newTree) => {

    console.log("====newTree");
    console.log(newTree);
    console.log("====newTree");
  //    setTreeData(newTree);

  //    dispatch(setUnionData(newData));
    const leftdata = newTree.map(item => ({
      data: item.data,
      droppable: item.droppable,
      id: item.id,
      parent: item.parent,
      text: item.text
    })); 
    console.log(leftdata);
  //    setTreeData(rightdata);
  if(!leftdata.includes(undefined) ){
    dispatch(setLeftUnionData1({left:leftdata}));
  //    console.log()
  //    dispatch(delLeftData({right:newTree}));
    }
  };
  return (
    <Box  className={classes.boxStyle}>

        <Tree
          tree={queryData }
          rootId={"0"}
          render={(node, { depth, isOpen, onToggle }) => (
            <CustomLeftNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          )}
          // onDrop={handleDrop}
          // classes={{
          //   root: styles.treeRoot,
          //   placeholder: styles.placeholderContainer
          // }}
          // sort={false}
          // insertDroppableFirst={false}
          // canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
          //   if (dragSource?.parent === dropTargetId) {
          //     return true;
          //   }
          // }}
          // dragPreviewRender={(monitorProps) => {
          //   return <CustomDragPreview monitorProps={monitorProps} />
          // }}
          classes={{
            root: styles.treeRoot,
            placeholder: styles.placeholderContainer
          }}          
          sort={false}
          onDrop={handleDrop}
          insertDroppableFirst={false}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {

            if (dragSource?.parent !== dropTarget?.parent) {
              return true;
            }
            else
            {
              return false;
            }
          }}
          dropTargetOffset={5}
          
        />
    </Box>
  );
}
