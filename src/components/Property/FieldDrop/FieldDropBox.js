import * as React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles } from 'tss-react/mui'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FilterVariant from './FieldVariant'
import { PropaneSharp } from '@mui/icons-material';
// import FilterOperator from './FilterOperator';
// import FilterValue from './FilterValue';

const useStyles = makeStyles()((theme) => {
  return {
    smFont: {
      fontSize: 11,
      fontFamily: 'monospace',
      fontStyle: 'italic'
    },
    startIcon: {
      width: 16,
      height: 16,
      padding: 8,
      color: '#1976D2'
    },
    indexBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 32,
      height: 32
    }
  }
});
export default function FilterDropBox({exchangeByNumber}){
  const { classes } = useStyles();

  const clickField = useSelector(state => state.query.clickField);
  const fieldCalcDrop = useSelector(state => state.query.fieldCalcDrop);

  const onDragEnd = (result) => {
    // Handle the onDragEnd event, e.g., update the positions of the items
  }
  
  const handleClick = (index) => {
//    props.exchangeByNumber(index);
//      let calcCommand;
//      let updatedCommand = calcCommand.replace(selectedCommand, `{${index}}`);
//      console.log("click__here"+index);
      exchangeByNumber(index+1);
  }
  return (

  //   <DragDropContext onDragEnd={onDragEnd}>
  //   <Droppable droppableId="droppable">
  //     {(provided) => (
  //       <div ref={provided.innerRef} {...provided.droppableProps}>
  //         {fieldCalcDrop.map((item, index) => {
  //           return (
  //             <Draggable key={item.filterVariant[0].id} draggableId={item.filterVariant[0].id} index={index}>
  //               {(provided) => (
  //                 <div
  //                   ref={provided.innerRef}
  //                   {...provided.draggableProps}
  //                   {...provided.dragHandleProps}
  //                 >
  //                   <Box sx={{display: 'flex', width: '100%', mt: 1}}>
  //                     <Box className={classes.indexBox}>
  //                       <Typography>{index + 1}</Typography>
  //                     </Box>
  //                     <Box sx={{width: '100%'}}>
  //                       <Grid spacing={1} container>
  //                         <Grid item xs={12}>
  //                           <FilterVariant index={index} value={item.filterVariant} />
  //                         </Grid>
  //                       </Grid>
  //                     </Box>
  //                   </Box>
  //                 </div>
  //               )}
  //             </Draggable>
  //           );
  //         })}
  //         {provided.placeholder}
  //       </div>
  //     )}
  //   </Droppable>
  // </DragDropContext>
    <Box sx={{ maxHeight: '80px', overflow: 'auto' }}>
      {
        
        fieldCalcDrop.map((item, index) => {
          let key = index !== fieldCalcDrop.length-1?item.filterVariant[0].id : 'filterFields-0';
          const disabled = index !== fieldCalcDrop.length-1? false : true;
          return (
            <Box key={key} sx={{display: 'flex', width: '100%', mt: 1}}> 
              <Box className={classes.indexBox}>
                <Typography>{index+1}</Typography>
              </Box>
              <Box sx={{width: '100%'}}>
                <Grid spacing={1} container>
                  <Grid item xs={12}>
                    <FilterVariant index={index} value={item.filterVariant}  handleParentSelect={handleClick}/>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          );
        })
      }
    </Box>
  );
}
