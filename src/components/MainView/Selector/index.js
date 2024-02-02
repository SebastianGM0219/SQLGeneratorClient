import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Tree } from "@minoru/react-dnd-treeview";
import { SelectorNode } from "./SelectorNode";
import { theme } from "./theme";
import styles from "./App.module.css";
import { makeStyles  } from 'tss-react/mui';
import HeaderText from "./HeaderText";
import {set} from '../../../slices/query'
import { setIsUnique, setUniqueTable,setFuncIndex } from "../../../slices/utility";
import { AddRelationData, setRelationData,initRelation, setAutoJoinRelation} from "../../../slices/query"
import { runQuery } from '../../../slices/query';
// import QueryService from '../../services/QueryService'
import QueryService from '../../../services/QueryService';
import { func } from "prop-types";
import Result from "../../sheet";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      backgroundColor: '#eeeeee',
      height: 'calc(100% - 24px)',
      borderRadius: 4,
      border: '1px #666666',
      borderStyle: 'dashed',
      overflowY: "auto"
    },
    treeRoot: {
      height: '100%',
      margin: '0px',
      padding: '6px'
    },
    placeholderContainer: {
      position: 'relative'
    }
  };
})

const runQueryAction = (queryInfo) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: 'QUERY_STARTED' });
      // Assuming runQuery returns a Promise
      runQuery(queryInfo)
        .then(data => {
          if (data === "yes") {
            resolve(data);
          } else {
            dispatch({ type: 'QUERY_COMPLETED', payload: data });
            resolve(data);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};

function Selector() {
  const { classes } = useStyles();
  const clickField = useSelector(state => state.query.clickField);

  const selectFields = useSelector(state => state.query.selectFields);
  const funcIndex = useSelector(state => state.utility.funcIndex);
  const [treeData, setTreeData] = useState(selectFields);
  const items = useSelector(state => state.table);
  const data_relation = useSelector(state => state.query.relationFields);
  const uniqueTable = useSelector(state => state.utility.uniqueTable);
  const dispatch = useDispatch();
  const rows = useSelector(state => state.query.foreginTable);
  React.useEffect(() => {
    setTreeData(selectFields)
  }, [selectFields]);

 
  const isForeignKey = (first, second) => {

      let index;  
      for(index=0;index<rows.length;index++)
      {
        let type_left = "left";
        let string = rows[index].constraint_definition;
        let table_left = [],field_left = [];
        table_left.push( rows[index].table_name);
  
        let pattern = /FOREIGN KEY \((\w+)\) REFERENCES (\w+)\((\w+)\)/;
        let matches = string.match(pattern);
  

        if(matches && matches[1])
        {
          matches[1] = matches[1].replace(/"/g, '');
          matches[2] = matches[2].replace(/"/g, '');
          matches[3] = matches[3].replace(/"/g, '');

          field_left.push( rows[index].table_name+'.' + matches[1]);
          
          let type_right = "right";
          let table_right = [],field_right = [];

          table_right.push(matches[2]);
          field_right.push( matches[2]+ '.' + matches[3]);
          
          if((second===table_left[0] && first === table_right[0]) )
          {
            dispatch(AddRelationData({leftTable:table_left, rightTable: table_right, leftField:field_left, rightField: field_right}));          
            return 1;

          }
          if( (first===table_left[0] && second === table_right[0]))
          {
            dispatch(AddRelationData({rightTable:table_left,  leftTable : table_right, rightField:field_left,  leftField: field_right}));          
            return 1;
          }
        }
      }

    return 0;
  };
  const setRelation = async(uniqueArray, newArray) => {

    //       const uniqueArray = uniqueTable.split(',').map(item => item.trim());
//       const arrayLength = 10; // This is the length of the array, you can replace it with your desired length

// // Initialize the array with false values
//       let checkAutoJoin = Array(arrayLength).fill(false);
//       initRelation();
//       let count_1=0;


//       let array_column=[];
      // uniqueArray.forEach((table)=>{
      //   items.forEach((item)=>{
      //     if(item.name === table)
      //     {
      //         const column=item.columns;
      //         array_column.push(column);
      //     }
      //   }) 
      // })

      // let j;
      let i,j;

      for(i = 0 ; i < uniqueArray.length-1 ; i++)
      {
        // if(checkAutoJoin[i]!=true)
          let array1, array2;
          items.forEach((item)=>{
            if(item.name === uniqueArray[i]){
                const column=item.columns;
                array1= column;
            }
          }) 

          items.forEach((item)=>{
            if(item.name === newArray[0]){
                const column=item.columns;
                array2= column;
            }
          }) 

          let table_right = [],field_right = [];
          let table_left = [],field_left = [];
          let k;
          let flag = isForeignKey(newArray[0],uniqueArray[i]);
          if(flag !== 1)
          {
            const commonColumns = array1.filter(item1 => array2.some(item2 => item2.name === item1.name) && item1.name !== "id");

            if(commonColumns.length>0)
            {
              table_left.push(uniqueArray[i]);
              field_left.push( uniqueArray[i]+ '.' + commonColumns[0].name);
              table_right.push( newArray[0]); 
              field_right.push( newArray[0] + '.' + commonColumns[0].name);
              let flag=1;
              if (commonColumns.length > 0) {
                dispatch(AddRelationData({leftTable:table_left, rightTable: table_right, leftField:field_left, rightField: field_right}));
                break;
              }
            }
            else
            {
               let m1,m2;            
//                for(m1 = 0 ;m1 < array1.length; m1++)
//                  for(m2 = 0 ;m2 < array2.length; m2++)
//                   {
//                     let left = uniqueArray[i];
//                     let right =newArray[0];
//                     if(array1[m1].name!=='id' || array2[m2].name!=='id')
//                     {
//                      let command = `SELECT
//                      CASE
//                          WHEN (
//                             SELECT COUNT(*)
//                              FROM (
//                                  SELECT DISTINCT ${array1[m1].name}
//                                  FROM ${left}
//                              ) AS c1
//                          ) = (
//                              SELECT COUNT(*)
//                              FROM (
//                                  SELECT DISTINCT ${array1[m1].name}
//                                  FROM ${left}
//                                  WHERE ${array1[m1].name} IN (SELECT DISTINCT ${array2[m2].name} FROM ${right})
//                              ) AS c2
//                          )
//                          OR
//                          (
//                             SELECT COUNT(*)
//                             FROM (
//                                 SELECT DISTINCT ${array2[m2].name}
//                                 FROM ${right}
//                             ) AS c1
//                          ) =
//                          (
//                            SELECT COUNT(*)
//                             FROM (
//                               SELECT DISTINCT ${array2[m2].name}
//                               FROM ${right}
//                               WHERE ${array2[m2].name} IN (SELECT DISTINCT ${array1[m1].name} FROM ${left})
//                            ) AS c2
//                          ) 
//                           THEN 'yes'
//                          ELSE 'no'
//                      END AS result;`
//                     let query=command;
//                      const queryInfo= {
//                       query: query
//                     }

//                     try{

//                     const res =  await QueryService.runQuery(queryInfo);
//                     const data = res.data;
//                       if (data && data.payload) {
//                         const { fields, rows } = data.payload;
//                         if(rows[0].result==="yes" )
//                         {
//                           let table_right = [],field_right = [];
//                           let table_left = [],field_left = [];
//                           table_left.push(uniqueArray[i]);
//                           field_left.push( uniqueArray[i]+ '.' + array1[m1].name);
//                           table_right.push( newArray[0]); 
//                           field_right.push( newArray[0] + '.' + array2[m2].name);

//                           dispatch(AddRelationData({leftTable:table_left, rightTable: table_right, leftField:field_left, rightField: field_right}));
// //                          i= uniqueArray.length-1;                     
//                           break;
//                         }
//                       } else {
//                         // Handle the case when data.payload is undefined
//                         console.log('data.payload is undefined');
//                         break;
//                       }
//                     } catch{
//                         break;                      
//                     }
//                   }
//                 }
            }
          }

   }
    // Your logic using the array and newArray parameters can go here
  };
  const handleDrop = (newTree) => {
    console.log("new==================");
    console.log(selectFields);
    let newItemData = {
      table: '',
      field: '',
      hader: ''
    };
    
    newTree.forEach(newItem => {
      let count = 0;
      treeData.forEach(preItem => {
        if(preItem.id !== newItem.id) count++;
      })
      if(count === treeData.length) {
        newItemData.table = newItem.data.table;
        newItemData.field = newItem.data.field;
      }
    })

    // let duplicated = false;
    // treeData.forEach(item => {
    //   if(item.data.field === newItemData.field) duplicated = true;
    // })

    let tableNameArray = [];
    const newData = newTree.map(item => {
      const {data: {table}} = item;
      const {data, droppable, id, parent, text} =  item;
      if(data.field === 'none') return undefined;
      if(!id.includes("function"))
        tableNameArray.push(table);

      if(id.includes("function")&&!id.match(/\d+/))
      {
        let dataNew = {...data, header_name: 'calculation'+'_'+funcIndex, command: ""};
        let idNew = 'function' + funcIndex;
        dispatch(setFuncIndex(funcIndex+1));
        return {data:dataNew, droppable, id:idNew, parent, text};
      } 
      else
      {
        return {data, droppable, id, parent, text};
      }
//      return {...item, data: { ...item.data, table: source,field: field,type:type}, text: sourceColumn};          
    })


    const uniqueArray = [...new Set(tableNameArray)];
    console.log(uniqueArray);
    const old_uniqueArray = uniqueTable.split(',').map(item => item.trim());
    const diff = uniqueArray.filter(item => !old_uniqueArray.includes(item));

    if(uniqueArray.length>=2 && diff.length>0)
    {
      console.log("here_array");
      console.log(uniqueArray);
      console.log(diff);
      setRelation(uniqueArray,diff);
    }
    if(!newData.includes(undefined) ){ //&& !duplicated
      const isUnique = uniqueArray.length===1?true:false;
//      const uniqueTableName = uniqueArray.length===1?uniqueArray[0]: '';
      const uniqueTableName = uniqueArray.join(' , ');
      setTreeData(newTree);
      dispatch(set(newData));
      dispatch(setIsUnique(isUnique));
      dispatch(setUniqueTable(uniqueTableName));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HeaderText/>
      <Box className={classes.boxStyle}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <SelectorNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              isSelected={clickField?clickField.id === node.id:0}
            />
          )}
          onDrop={handleDrop}
          classes={{
            root: classes.treeRoot,
            placeholder: classes.placeholderContainer
          }}
          sort={false}
          insertDroppableFirst={false}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
            // console.log("==========RS++++++++++++++++++");
            // console.log(dragSource?.parent);
            // console.log(dropTargetId);

            // console.log("==========RS++++++++++++++++++");

            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          dropTargetOffset={5}
        />
      </Box>
    </ThemeProvider>
  );
}

export default Selector;
