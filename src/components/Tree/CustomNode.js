import React, { useState} from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "../common/Tree/TypeIcon";
import CreateViewDialog  from "../Dialogs/CreateViewDailog";
import styles from "./CustomNode.module.css";
import { useDispatch, useSelector } from "react-redux";
import {getTables, updateItem} from '../../slices/table'

import {resetBasedOnCommand,initAllState} from '../../slices/query';
import { setCodeSQL } from "../../slices/utility";
import {basedOnCommandConsole} from "../../slices/consolequery"
const ContextMenu = ({ position, onEditClose, onDeleteClose}) => {
  // Add any required logic and content for the context menu component
  return (
    <div 
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        border: '1px solid #ccc',
        background: '#fff',
        padding: '5px',
      }}
    >
      {/* Add context menu items and actions */}
      <div onClick={onEditClose}>Edit</div>
      <div onClick={onDeleteClose}>Delete</div>
      {/* Add more context menu items as needed */}
    </div>
  );
};
export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;
  const dispatch = useDispatch();

  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [createViewDialog, setCreateViewDialog] = React.useState(false);
  const tables = useSelector(state => state.table);
  
  const isView = (name) => {
    const filterTable = tables.filter(item => item.name ===name)[0];
    // console.log("valueeee");
    // console.log(filterTable?filterTable.table_type.isView:0);
    // console.log("valueeee");

    return filterTable?filterTable.table_type.isView:0;
//    console.log(filterTable.table_type.isView);
  }

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
//    props.onSelect(props.node.id);
    props.onSelect(props.node.id);

    if(isView(props.node.data.table) == 1)
    {
      setContextMenuOpen(true);
    }
    else
      setContextMenuOpen(false);

  };
  
  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };
  const handleCreateView = () => {
    
    setCreateViewDialog(true);
  }
  const handleCreateViewClose = () => {
    setCreateViewDialog(false);
  }
  const SaveView =  (viewName, queryCommand) => {

  //   let query=`CREATE VIEW ${viewName} AS ${queryCommand}`; 
  //   const queryInfo= {
  //    query: query
  //  }
  //  console.log(queryInfo);
  //  dispatch(runQuery(queryInfo))
  //  .then(async(data) => {
  //     setCreateViewDialog(false);
  //       const res = await TableService.getTables();
  //       dispatch(addUpdateItem({newArray: res.data}));
  //       console.log("think");
  //       console.log(res);
  //  })
  //  .catch();

  //  dispatch(connectDB(dbInfos))
  //  .unwrap()
  //  .then(data => {
  //     if(data.success){ 
  //       setAddDialog(false);
  //       setSuccessOpen(true);
  //       setSuccess(true)
  //     }
  //     else {
  //       setFailOpen(true);
  //       setSuccess(false);
  //     }
  //  })
  //  .catch(err => {
  //    setFailOpen(true);
  //  })
  }
  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent }}
//      onContextMenu={handleContextMenu}
      onSelect={()=>{    setContextMenuOpen(false);
      }}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ""
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </div>
      <div>

        {props.node.id !== "function" && <TypeIcon droppable={droppable || false} type={(isView(props.node.data.table) == 1&&(data?.type=="Table" || data?.type=="List")) ? "View" : data?.type} />}
        {props.node.id === "function" && <span style={{fontFamily: 'Segoe UI', fontStyle: 'italic'}}> fx </span>}
      </div>
      <div className={styles.labelGridItem}>
        <Typography variant="body2">{`${props.node.text.toUpperCase()}`}</Typography>
      </div>
      <div>
        {data.isKey && <TypeIcon type="Key" />}
      </div>
      <CreateViewDialog open={createViewDialog} handleCreateViewClose={handleCreateViewClose} SaveView={SaveView} />

      {props.isSelected===true && isContextMenuOpen && (
        <ContextMenu
          position={{ x: contextMenuPosition.x, y: contextMenuPosition.y }}
          onEditClose={() => {
            setContextMenuOpen(false);
            const name = props.node.id.split("-")[0];
            const filterTable = tables.filter(item => item.name ===name)[0];
//            dispatch(setCodeSQL(filterTable.table_type.viewCommand));
            dispatch(initAllState());
            dispatch(resetBasedOnCommand({command:filterTable.table_type.viewCommand,tables:tables}));
            basedOnCommandConsole({command:filterTable.table_type.viewCommand});
//            setCreateViewDialog(true);
          }}
          onDeleteClose={() => {
            setContextMenuOpen(false);
          }}
          // Add any required props or actions for the context menu
        />
      )}
    </div>
  );
};
