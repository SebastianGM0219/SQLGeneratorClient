import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';

import { setCurTab, setCurColumn } from "../../../slices/utility";

const FilterTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: 0,
    fontFamily: 'monospace',
    fontSize: 12,
    minHeight: 32,
    background: '#eeeeee',
    fontStyle: 'italic'
  },
  '& .MuiInputBase-input': {
    borderLeft: '1px solid #b4b4b4',
    padding: 4,
    paddingLeft: 8,
  },
  '& .MuiInputAdornment-root': {
    marginRight: 7,
    marginLeft: 7
  },
  width: '100%'
}));

export default function FilterValue({index, type, value, disabled}) {
  const dispatch = useDispatch();
  const curColumn = useSelector(state => state.query.filterFields[index]);

  let initialValue = "Empty String";
  if(value.isParam && value.parameter !== "") {
    initialValue = `: ${value.parameter} (default: '${value.default}')`;
  }
  else 
  initialValue = value.default;
  if(value === undefined) initialValue = 'Empty String';
  const [text, setText ] = React.useState(initialValue); 

  React.useEffect(() => {
    const filterValue = curColumn.filterValue;
    let cInitialValue = "Empty String";
    if(filterValue.isParam && filterValue.parameter !== "") {
      cInitialValue = `: ${filterValue.parameter} (default: '${filterValue.default}')`;
    }
    else cInitialValue = filterValue.default;
    setText(cInitialValue)
  }, [curColumn]);

  const handleFocus = (e) => {
    dispatch(setCurTab(1));
    const currentColumn = {
      source: curColumn.filterVariant[0].data.table,
      column: curColumn.filterVariant[0].data.field,
      data: {
        type: curColumn.filterVariant[0].data.type,
        // isList: false,
        isParam: value.isParam,
        value: value.isParam ? value.parameter: value.default
      }
    };
    dispatch(setCurColumn({currentColumn}))
  }

  return (
    <Box>
      <FilterTextField onFocus={handleFocus} value={text} disabled={disabled}/>
    </Box>
  )
}
