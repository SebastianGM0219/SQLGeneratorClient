import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from '@uiw/react-textarea-code-editor';

import { makeStyles  } from 'tss-react/mui';
import { setCodeSQL, setEdited } from '../../slices/union';
// import { setCodeSQL, setEdited } from './../../slices/union'

const useStyles = makeStyles()((theme) => {
  return {
    editorStyle: {
      fontSize: 14,
      backgroundColor: "rgb(15, 25, 36)",
      marginTop: 32
    }
  };
});

export default function CodeView() {
  const {classes} = useStyles();
  const [defaultList, setDefaultList] = React.useState('');
  const items = useSelector(state => state.union.rightTree);
  const unionType = useSelector(state => state.union.unionType);

  React.useEffect(()=>{
    setDefaultList("");
    let string = "";
    items.map((item,index) => {
      string += "(\n";
      string += item.data;
      string += ")\n";

      string += '\n';
      if(index<items.length-1)
      {
        string += unionType;
        string += '\n';
        string += '\n';
      }
    }); 
    setDefaultList(string);
    dispatch(setCodeSQL({codeSQL:string}));

  },[items,unionType])
  const dispatch = useDispatch();

  // function process_date(updatedString) {
  //   let extractedValue = updatedString.match(/DAY\((.*)\)/)[1];
  //   updatedString = updatedString.replace(/DAY\((.*)\)/, `EXTRACT(DAY FROM ${extractedValue})`);
  
  //   // Your other logic for processing the date string goes here
  
  //   return updatedString; // Return the updated string
  // }

  const handleDefaultList = (e) => {
    setDefaultList(e.target.value);
    dispatch(setCodeSQL({codeSQL:e.target.value}));
//    dispatch(setEdited(true));
//    dispatch(setCodeSQL(e.target.value));
  }

  return <CodeEditor 
            value={defaultList} 
            language='sql' 
            onChange={handleDefaultList} 
            style={{
              marginTop: '0px',
              height: '100%',  // Set the desired height here
              padding: '0',      // Remove padding
              overflow: 'auto',  // Enable auto-scroll
              '--color-prettylights-syntax-sublimelinter-gutter-mark': '#DCB862',
            }}
            className={classes.editorStyle}
            disabled={true}
          />
}