import React, { useState } from "react";
import { useSelector } from 'react-redux'
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Box } from "@mui/material";
import { Tree } from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { theme } from "./theme";
import styles from "./CustomTreeView.module.css";
import { CustomDragPreview } from "../common/Tree/CustomDragPreview";
import {getTables, updateItem} from '../../slices/table'

function CustomTreeView() {
  const items = useSelector(state => state.table);
  const tables = useSelector(state => state.table);
  
    let SampleData = [];
    items.map( item => {
    if(item.isChecked){
      const columns = item.columns;
      const type = item.hasKey? 'List' : 'Table';
      const parentData = {
        id: item.name+'-None-'+type,
        droppable: true,
        parent: '0',
        text: item.name,
        data: {
          type: type,
          isKey: false,
          table: item.name,
          field: 'none',
          header_name: 'none',
          aggreType: 'none',
          hasKey: item.hasKey,
          columnId: item.name
        }
      };
      const columnArray = columns.map(column => {
        return {
          id: item.name+'-'+column.name+'-'+column.type,
          droppable: false,
          parent: item.name+'-None-'+type,
          text: column.name,
          data: {
            type: column.type,
            isKey: column.isKey,
            table: item.name,
            header_name: column.name, 
            field: column.name,
            columnId: column.name,
            aggreType: column.aggreType,
            hasKey: item.hasKey
          }
        };
      });
      const newArray = [parentData, ...columnArray];
      const prevArray = SampleData;
      SampleData = [...prevArray, ...newArray];
    }
  });

  const [treeData, setTreeData] = useState(SampleData);
  // Inside the CustomNode component
  const [selectedNodes, setSelectedNodes] = useState("");  
  const handleSelect = ( node) => {
      setSelectedNodes(node);
  };
  
  React.useEffect(() => {
    SampleData = [];
    const parentData = {
      id: 'function',
      droppable: false,
      parent: '0',
      text: 'Calculation',
      data: {
        type: 'None',
        isKey: false,
        table: 'None',
        aggreType: 'none',
        header_name: 'Calculation',
        field: 'None',
        hasKey: 'None',
        columnId: 'None'
      }
    };
    SampleData=[parentData];
    items.map( item => {
      if(item.isChecked){
        const columns = item.columns;
        const type = item.hasKey? 'List' : 'Table';
        const parentData = {
          id: item.name+'-None-'+type,
          droppable: true,
          parent: '0',
          text: item.name,
          data: {
            type: type,
            isKey: false,
            table: item.name,
            header_name: 'none',
            field: 'none',
            hasKey: item.hasKey,
          }
        };
        const columnArray = columns.map(column => {
          return {
            id: item.name+'-'+column.name+'-'+column.type,
            droppable: false,
            parent: item.name+'-None-'+type,
            text: column.name,
            data: {
              type: column.type,
              isKey: column.isKey,
              table: item.name,
              field: column.name,
              header_name: column.name,
              columnId: column.name,
              aggreType: 'none',
              hasKey: item.hasKey
            }
          };
        });
        const newArray = [parentData, ...columnArray];
        const prevArray = SampleData;
        SampleData = [...prevArray, ...newArray];
      }
    });
    setTreeData(SampleData);
  }, [items]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box className={styles.app}>
            <Tree
              tree={treeData}
              rootId={"0"}
              render={(node, { depth, isOpen, onToggle }) => (
                <CustomNode
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  onToggle={onToggle}  
                  onSelect={handleSelect}      
                  isSelected={selectedNodes === node.id}                  
                />
              )}
              dragPreviewRender={(monitorProps) => {
                return <CustomDragPreview monitorProps={monitorProps} />
              }}
              classes={{
                root: styles.treeRoot,
                draggingSource: styles.draggingSource,
                placeholder: styles.placeholderContainer
              }}
              sort={false}
              insertDroppableFirst={false}
              canDrop={() => { return false; }}
              dropTargetOffset={5}
            />
        </Box>
    </ThemeProvider>
  );
}

export default CustomTreeView;
