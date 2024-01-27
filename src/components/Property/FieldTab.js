import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid,InputBase, FormControlLabel, Switch, Button,FormControl } from '@mui/material';
import { makeStyles  } from 'tss-react/mui';
import { TypeIcon } from '../common/Tree/TypeIcon';
import ParameterEditor from '../common/ParameterEditor';
import { setFieldCalcDrop, setFilterValue } from '../../slices/query';
import TypeSelector from '../common/TypeSelector';
import { alpha, styled } from '@mui/material/styles';
import { CheckBox, TextFields } from '@mui/icons-material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { runQuery } from '../../slices/query';
import { setTreeOpened, setSheetOpened } from '../../slices/utility'
import { saveFunc } from '../../slices/savedata'
import { setValueSelector, setValueSelectorInCalc} from '../../slices/query'
import { getTables, updateItem} from '../../slices/table'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import clsx from 'clsx';
import FuncDropDownMenu from '../common/FuncDropDownMenu';
import FieldDropBox from './FieldDrop/FieldDropBox';
import AceEditor from "react-ace";
import { setIsUnique, setUniqueTable, setFuncIndex } from "../../slices/utility";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";
//import  {updateItem}  from '../../slices/savedata'; // Import the setDuplicateState action from the duplicate slice

const useStyles = makeStyles()((theme) => {
  return {
    headerBox: {
      padding: 24,
      borderBottom: '1px solid #eeeeee',
    },
    headerFont: {
      fontWeight: 600,
      color: '#0D1F3A'
    },
    typoFont: {
      fontSize: 15,
      fontWeight: 600,
      color: '#424450'
    },
    boxStyle: {
      display: 'flex',
      alignItems: 'center'
    },  
    iconBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    borderedBox: {
      backgroundColor: '#eeeeee',
      border: '1px #666666',
      borderStyle: 'dashed',
      borderRadius: 4,
      padding: 6,
      marginBottom: 4
    },
    labelGridItem: {
      paddingInlineStart: 8
    },
    labelFont: {
      fontSize: 14,
      fontWeight: 600,
      color: '#505050'
    },
    gridBox: {
      paddingTop: 4,
      paddingBottom: 4
    },
    grayColor: {
      color: '#b4b4b4',
      width: 16,
      height: 16
    },
    defBox: {
      borderTop: '1px solid #eeeeee'
    },
    vSpacing: {
      marginTop: 8,
      marginLeft: -6
    },
  }
});
const QueryInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-input': {
    // textTransform: 'uppercase',
    borderRadius: 4,
    position: 'relative',
    border: '1px solid',
    borderColor: '#b4b4b4',
    fontSize: 14,
    marginTop:5,
    marginBottom: 5,
    padding: '5px 7px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const CustomComboBox = styled(Select)(({ theme }) => ({
  width: '100%',
  border: '1px solid #b4b4b4',
  borderRadius: 4,
  marginTop: '5px',
  '& .MuiInputBase-input': {
    borderColor: '#b4b4b4',
    fontSize: 14,
    width: '100%',
    padding: '5px 7px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  // Add custom styles for the MenuItem component here
  fontSize: 14,
  color: '#333',
  padding: '10px',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}));
export default function FieldTab() {
  const { classes } = useStyles();
  const currentColumn = useSelector(state => state.utility.currentColumn);
  const [parameter, setParameter] = React.useState('');
  const [isParameter, setIsParameter] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [type, setType] = React.useState('Text');
  const [name, setName] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [aggreType, setAggreType] = React.useState("none");
  const filterFields = useSelector(state => state.query.filterFields);
  const parameters = useSelector(state => state.utility.parameters);
  const clickField = useSelector(state => state.query.clickField);
//  const items = useSelector(state => state.temp_table);
  const tableState = useSelector(state => state.table);
  const items = useSelector(state => state.savedata);
  const [calcCommand, setCalcCommand] = React.useState("");
  const fieldCalcDrop = useSelector(state => state.query.fieldCalcDrop);
  let tableNameArray = useSelector(state => state.utility.uniqueTable); 
// Dispatch an action to update the state of the duplicate slice with the state from the first slice
  const dispatch = useDispatch();
  const aceEditorRef = React.useRef(null); // Create a reference to the AceEditor component

  const handleAggreChange = (e) => {
    setAggreType(e.target.value);
  }
  const handleTypeChange = (value) => {
    setType(value);
  }
  const handleName = (e) => {
    setName(e.target.value);
  }
  const onChange = (newValue)=> {
    setCalcCommand(newValue);
//    dispatch(setCalcText(newValue));    
  }

  const handleApply = (e) => {    
    //=============in case of multiple function===========
    if(!clickField.id.includes("function"))
    {
  
      dispatch(setValueSelector({id:clickField.id, name: name, aggreType: aggreType}));
    }
    else
    {
      //dispatch(setSourceColumnSelector({id:newTree[0].id, sourceColumn: newTree[0].data.header_name, source: newTree[0].data.table,field:newTree[0].data.field,type:newTree[0].data.type}));
      if(fieldCalcDrop[0] && fieldCalcDrop[0].filterVariant && fieldCalcDrop[0].filterVariant[0] && fieldCalcDrop[0].filterVariant[0].data) {
        tableNameArray=(fieldCalcDrop[0].filterVariant[0].data.table);
        //const isUnique = tableNameArray==uniqueTable?true:false;
        // const uniqueTableName = uniqueArray.length===1?uniqueArray[0]: '';
        // const uniqueArray = [...new Set(tableNameArray)];
        dispatch(setIsUnique(true));
        dispatch(setUniqueTable(tableNameArray));
      }
      if(fieldCalcDrop.length==2)
          dispatch(setValueSelectorInCalc({id:clickField.id, name: name, command: calcCommand, dropbox: fieldCalcDrop,columnId:fieldCalcDrop[0].filterVariant[0].data.columnId, table:fieldCalcDrop[0].filterVariant[0].data.table, type:fieldCalcDrop[0].filterVariant[0].data.type, field:fieldCalcDrop[0].filterVariant[0].data.field}));       
      else if(fieldCalcDrop.length>2)
          dispatch(setValueSelectorInCalc({id:clickField.id, name: name, command: calcCommand, dropbox: fieldCalcDrop,columnId:"Multiple",table:fieldCalcDrop[0].filterVariant[0].data.table, type: "Multiple"}));
      else 
          dispatch(setValueSelectorInCalc({id:clickField.id, name: name , command: calcCommand, dropbox: fieldCalcDrop,columnId:"None",table:"None"}));
     }
  }


  React.useEffect(() => {

    if(!clickField || !clickField.id) {
      return;
    }
    if(clickField.id.includes("function")){
      setCalcCommand(clickField.data.command);
      setName(clickField.data.header_name);
    } else{
      setName(clickField.data.header_name);
      setType(clickField.data.type);  
    }
    if (aceEditorRef.current) {
      aceEditorRef.current.editor.focus(); // Focus on the AceEditor component
    }
  }, [clickField])


  const focusEditor = () => {
    if (aceEditorRef.current) {
      const editor = aceEditorRef.current.editor;

      editor.focus(); // Set focus on the AceEditor component
      const session = editor.getSession();
      const length = session.getDocument().getLength(); // Get the length of the text
      editor.gotoLine(length, session.getDocument().getLine(length - 1).length); // Set the cursor to the end of the text
    }
  }

  const exchangeByNumber = (index) => {
    if(aceEditorRef.current)
    {
      const editor = aceEditorRef.current.editor;
      editor.focus(); // Set focus on the AceEditor component
      const selectionRange = editor.getSelectionRange(); 
      const selectedText = editor.getSession().getTextRange(selectionRange);

      let updatedCommand = calcCommand.replace(selectedText, `{${index}}`);

      const session = editor.getSession();

      const content = session.getValue();
      setCalcCommand(updatedCommand);

      // console.log("updatedcommand")';'
      // console.log(updatedCommand);
      const endPosition = {
        row: session.getLength() - 1,
        column: content.length
      };

      editor.moveCursorToPosition(endPosition);
    }
  }

  return (
    <Box sx={{position: 'relative', height: '100%'}}>
      <Box sx={{ position: 'absolute', bottom: 4, left: 12}}>
        {/* <Button variant='contained' disabled={disabled} onClick={handleApply}>Apply</Button> */}
        <Button variant='contained' disabled={false} onClick={handleApply}>Apply</Button>
      </Box>
      <Box className={classes.headerBox}>
        <Typography className={classes.headerFont}>Field Propterties</Typography>
      </Box>
      {/* {clickField} */}
      {clickField && Object.keys(clickField).length !== 0 &&!clickField.id?.includes("function")&&
      <Box sx={{padding: 1.5}}>
        <Box>
          <Grid className={classes.gridBox} container>
            <Grid item xs={3}>
              <Typography className={classes.labelFont}>Source</Typography>
            </Grid>
            <Grid item xs={9}>
              <Box className={classes.boxStyle}>
                <Box> 
                <TypeIcon droppable={false} type={clickField.data?.hasKey?'List':'Table'} />
              </Box>
              <Box className={classes.labelGridItem}>
                <Typography variant="body2">{`${clickField.data.table}`}</Typography>
              </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid className={classes.gridBox} container>
            <Grid item xs={3}>
              <Typography className={classes.labelFont}>Column</Typography>
            </Grid>
            <Grid item xs={9}>
              <Box className={classes.boxStyle}>
                <Box>
                  <TypeIcon droppable={false} type={clickField.data?.type} />
                </Box>
                <Box className={classes.labelGridItem}>
                  <Typography variant="body2">{`${clickField.text}`}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.defBox}>
          <Grid sx={{marginTop: 2}} container>
            {/* <Box>    
              <QueryInput defaultValue="" id="parameter-name" placeholder='Click to add a name' onChange={handleName}  />
             </Box> */}
            <Grid item className={classes.boxStyle} xs={3}>
              <Typography className={classes.labelFont}>Header</Typography>
            </Grid>
            <Grid item xs={9}>
              <Box>
                <QueryInput defaultValue="" id="parameter-name" placeholder='Click to add a name' value={name} onChange={handleName}  />
              </Box>
            </Grid>
            <Grid item className={classes.boxStyle} xs={3}>
              <Typography className={classes.labelFont}>Type</Typography>
            </Grid>
            <Grid item xs={9}>
              <Box>
                <TypeSelector value={type} onTypeChange={handleTypeChange} />
              </Box>
            </Grid>
            <Grid item className={classes.boxStyle} xs={3}>
              <Typography className={classes.labelFont}>Aggregation</Typography>
            </Grid>
            <Grid item xs={9}>
                <CustomComboBox value={aggreType} onChange={handleAggreChange}>
                  <CustomMenuItem value="none">No Aggregation</CustomMenuItem>
                  <CustomMenuItem value="sum">Sum of </CustomMenuItem>
                  <CustomMenuItem value="count">Count of </CustomMenuItem>
                  <CustomMenuItem value="max">Max of</CustomMenuItem>
                  <CustomMenuItem value="min">Min of</CustomMenuItem>
                  <CustomMenuItem value="avg">Average of</CustomMenuItem>
                </CustomComboBox> 
            </Grid>            
          </Grid>
        </Box>
      </Box>}
      {clickField && Object.keys(clickField).length !== 0 &&clickField.id?.includes("function")&&
      <Box sx={{padding: 1.5}}>
          <Box>
            <FormControl variant="standard" sx={{ width: '100%'}}>
              <Typography className={classes.typoFont}>Header</Typography>
              <QueryInput defaultValue="" id="parameter-name" placeholder='Click to add a name' value={name} onChange={handleName}  />
            </FormControl>
          </Box>

          <Box sx={{display: 'flex', paddingTop: 2, paddingBottom: 2}}>
              <Grid item className={classes.boxStyle} xs={9}>
                <Box className={classes.iconBox}>
                  <Typography className={clsx(classes.labelFont, classes.boldFont)}>Calulation </Typography>
                  <HelpOutlineIcon className={classes.grayColor}/>
                </Box>
              </Grid>
              <Grid item className={classes.boxStyle} xs={3}>
                <FuncDropDownMenu focusEditor ={focusEditor}calcCommand={calcCommand} setCalcCommand={setCalcCommand}/>              
              </Grid>  
          </Box> 
          <Box>
            <AceEditor
             width={400} height={200}
                placeholder="null"
                mode="mysql"
                theme="textmate"
                name="blah2"
                onChange={onChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={calcCommand}
                ref={aceEditorRef} 
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}/>
          </Box> 
          <Box sx={{display: 'flex', paddingTop: 2, paddingBottom: 2}}>
              <Grid item className={classes.boxStyle} xs={9}>
                <Box className={classes.iconBox}>
                  <Typography className={clsx(classes.labelFont, classes.boldFont)}>Included Columns </Typography>
                </Box>
              </Grid>
          </Box> 
          <Box className={classes.boxMarginTop}>
            <FieldDropBox exchangeByNumber={exchangeByNumber}/>
          </Box>
      </Box>}      
    </Box>
  )
}