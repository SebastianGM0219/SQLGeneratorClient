import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {Box} from "@mui/material";
import { CustomRightNode } from "./CustomRightNode";
import { Tree } from "@minoru/react-dnd-treeview";
import { makeStyles  } from 'tss-react/mui';
import styles from "./App.module.css";
import {  setRightUnionData } from "../../slices/union";
import { useSelector } from "react-redux";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      backgroundColor: '#eeeeee',
      // height: 'calc(100% - 20px)',
      height: '100%',
      padding: '7px'
//      borderRadius: 4,
//      border: '1px #666666',
      // border: '1px solid #666666'
    },
    treeRoot: {
      height: '100%'
    },
    placeholderContainer: {
      position: 'relative'
    }
  };
})


export default function CustomRightTree(props) {
  const { classes } = useStyles();
  const sessionDbInfos = localStorage.getItem('dbQuery');
  let items= sessionDbInfos ? JSON.parse(sessionDbInfos):[];

  const [treeData, setTreeData] = useState([]);
  const queryData = useSelector(state => state.union.rightTree);

  const dispatch = useDispatch();
  const handleDrop = (newTree) => {

//    setTreeData(newTree);

//    dispatch(setUnionData(newData));
    const rightdata = newTree.map(item => ({
      data: item.data,
      droppable: item.droppable,
      id: item.id,
      parent: item.parent,
      text: item.text
    })); 
//    setTreeData(rightdata);
  if(!rightdata.includes(undefined) ){
    dispatch(setRightUnionData({right:rightdata}));
    }
  };

  return (
    <Box  className={classes.boxStyle}>
        <Tree
          tree={queryData}
          rootId={"0"}
          render={(node, { depth, isOpen, onToggle }) => (
            <CustomRightNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          )}
          onDrop={handleDrop}
          // canDrop={() => {return true;}}
          insertDroppableFirst={false}
          dropTargetOffset={15}
          sort = {false}
          classes={{
            root: styles.treeRoot,
            placeholder: styles.placeholderContainer
          }}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {

            if (dragSource?.parent !== dropTarget?.parent) {
              return true;
            }
            else
            {
              return false;
            }
          }}
        />
    </Box>
  );
}
