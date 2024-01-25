import * as React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Paper, FormControl, MenuItem, ListSubheader, Select, ListItemText, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

import { TypeIcon } from '../../common/Tree/TypeIcon';

import { setRelationData } from "../../../slices/query";

const DropPaper = styled(Paper)(({theme}) => ({
  textAlign: 'center',
  fontSize: 12,
  paddingTop: 4,
  paddingBottom: 5,
  background: '#eeeeff',
  border: '1px #666666',
  borderStyle: 'dashed',
}));

const DropListSubHeader = styled(ListSubheader)(({theme}) => ({
  display: 'flex',
  '& .MuiListItemIcon-root': {
    alignItems: 'center',
    minWidth: 24
  },
  '& .MuiListItemText-root': {
    textTransform: 'uppercase',
  },
  '& .MuiListItemText-root>.MuiTypography-root': {
    fontSize: 14
  }
}));

const DropMenuItem = styled(MenuItem)(({theme}) => ({
  '& .MuiListItemIcon-root': {
    marginLeft: 12,
    minWidth: 24
  },
  '& .MuiListItemText-root>.MuiTypography-root': {
    fontSize: 14
  }
}));

const DropSelect = styled(Select)(({theme}) => ({
  '& .MuiSelect-select': {
    display: 'flex',
    padding: 0
  },
  '& .MuiSelect-select>.MuiListItemIcon-root': {
    alignItems: 'center',
    minWidth: 24,
    marginLeft: 8  
  },
  '& .MuiSelect-select>.MuiListItemText-root>.MuiTypography-root': {
    fontSize: 14
  },
  minHeight: 32
}));

const useStyles = makeStyles()((theme) => {
  return {
    fontStyle: {
      fontSize: 14
    },
    topMargin: {
      marginTop: 8
    }
  };
});

export default function DataField(props) {
  const { classes } = useStyles();
  const { data }  = props.node;
  const { table, field, index, type } = data;
  const headerText = table.length===0 ? 'Drag & Drop source': table.length===1?table[0]:`JOIN ${table.length-1}`

  const dispatch = useDispatch();
  const allTable = useSelector(state => state.table)

  let items = [];
  if(table.length !== 0) {
    let filtered = [];
    filtered = allTable.filter(item => table.includes(item.name))
    filtered.map(item => {
      const firstValue = {
        type: 'table',
        text: item.name,
        dataType: item.hasKey? 'List': 'Table',
        value: item.name+'.none'
      };  
      items.push(firstValue);
      item.columns.map(detail => {
        items.push({
          type: 'field',
          dataType: detail.type,
          text: detail.name,
          value: item.name+'.'+detail.name
        });
        
      });
    });
  }
  const fieldArray = field.map(fieldItem => {
    if(fieldItem.endsWith("none"))
    {
        return items[1].value;
      }
      return fieldItem;
    });

  const [values, setValues] = React.useState(fieldArray);
  React.useEffect(() => {
    const fieldArray = field.map(fieldItem => {
      if(fieldItem.endsWith("none")){
        return items[1].value;
      }
      return fieldItem;
    });
  
    setValues(fieldArray)
  }, [field])
  
  const handleChange = (event, i) => {
    const changed = event.target.value;
    setValues((prev) => {
      const updated = [...prev];
      updated[i] = changed;
      dispatch(setRelationData({index, type, table, field: updated}))
      return updated;
    });
  }


  return (
    <Box>
      <DropPaper elevation={0} className={classes.topMargin}><Typography className={classes.fontStyle}>{headerText}</Typography></DropPaper>
        {
          values.map((value, index) => (
            <FormControl key={index} sx={{width: '100%'}} className={classes.topMargin}>
              <DropSelect 
                onChange={(e) => {handleChange(e, index)}}
                value={value}
              >
                {
                  items.map(item => {
                    const content = (
                      <>
                        <ListItemIcon>
                          <TypeIcon type={item.dataType} className={classes.fontStyle} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} className={classes.fontStyle} />
                      </>
                    );
                    return item.type === 'table' ? (
                      <DropListSubHeader key={item.value} className={classes.fontStyle} >{content}</DropListSubHeader>
                    ) : (
                      <DropMenuItem key={item.value} value={item.value} className={classes.fontStyle}>{content}</DropMenuItem>
                    );
                  })
                }
              </DropSelect>
            </FormControl>
          ))
        }
    </Box>
  )
}