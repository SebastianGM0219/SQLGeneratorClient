import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles  } from 'tss-react/mui';
import { Oval } from  'react-loader-spinner';
import { AppBar, Box, Container, Grid, Paper, Toolbar, Button, Typography, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import MuiAlert from '@mui/material/Alert';
import DescriptionIcon from '@mui/icons-material/Description';
import AddTableDialog from './components/Dialogs/AddTableDialog';
import NewConnection from './components/Dialogs/NewConnection';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import WifiIcon from '@mui/icons-material/PlayCircle';
import Modal from './components/Dialogs/Modal';
import CustomTreeView from './components/Tree/CustomTreeView';
import MainView from './components/MainView';
import PropertyView from './components/Property'
import Result from './components/sheet';
import {getTables, addUpdateItem} from './slices/table'
import ParameterDialog from './components/Dialogs/ParameterDialog';
import CreateViewDialog from './components/Dialogs/CreateViewDailog';
import { initAllState} from "./slices/query";
import { initAllUtility} from "./slices/utility";
import { initAllDatabaseTable} from "./slices/database";
import { initAllTable} from "./slices/table";
import {connectDB} from './slices/database'
import { runQuery } from './slices/query';
import {setTreeOpened, setSheetOpened} from './slices/utility'
import TableService from './services/TableService'
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      width: '100%'
    },
    treeBoxStyle: {
      borderBottom: '1px solid #ddd'
    },
    treeHeight: {
      height: 'calc(100% - 62px)',
      overflow: 'auto'
    },
    loadingBox: {
      position: "absolute",
      width: '100%', height: '100%',
      background: '#50657a1a',
      zIndex: 1000
    },
    loadingContent: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }
  };
})

const useStyleButton = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  startIcon: {
    marginBottom: 4
  }
});
function App() {
  const { classes } = useStyles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [failOpen, setFailOpen] = React.useState(false);
  const [addDialog, setAddDialog] = React.useState(false);
  const [paramDialog, setParamDialog] = React.useState(false);
  const [createViewDialog, setCreateViewDialog] = React.useState(false);

  const dispatch = useDispatch();

  const isConnected = useSelector(state => state.database.success);
  const isTreeOpened = useSelector(state => state.utility.treeOpened);
  const queryData = useSelector(state => state.query);
  const joinCommand = useSelector(state => state.query.joinCommand);
  const isCrossTab = useSelector(state => state.utility.isCrossTab);
  const crosstabSelectors = useSelector(state => state.query.crosstabSelectorFields);
  const crosstabColumns = useSelector(state => state.query.crosstabColumnFields);
  const crosstabValues = useSelector(state => state.query.crosstabValueFields);
  const edited = useSelector(state => state.utility.edited);
  const codeSQL = useSelector(state => state.utility.codeSQL);
  const parameters = useSelector(state => state.utility.parameters);
  const isUnique = useSelector(state => state.utility.isUnique);
  const uniqueTable = useSelector(state => state.utility.uniqueTable);
  const dbInformation = useSelector(state => state.database.dbInfo);
  const {buttonStyle} = useStyleButton();
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsLoading(false);
  };

  const handleClickAddTables = () => {
    setAddDialog(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    setOpen(false);
  };

  const handleFailClose = () => {
    setFailOpen(false);
  };

  const handleAddTableClose = () => {
    setAddDialog(false);
    dispatch(setTreeOpened(true));
  }
  const handleTableClose = () => {
    setAddDialog(false);

  }
  const handleParamClose = () => {
    setParamDialog(false);
  }

  const handleCreateView = () => {
    
    setCreateViewDialog(true);
  }
  const handleCreateViewClose = () => {
    setCreateViewDialog(false);
  }
  const handleConnect = (dbInfos) => {
     dispatch(connectDB(dbInfos))
      .unwrap()
      .then(data => {
         if(data.success){ 
           setAddDialog(false);
           setSuccessOpen(true);
           setSuccess(true)
         }
         else {
           setFailOpen(true);
           setSuccess(false);
         }
      })
      .catch(err => {
        setFailOpen(true);
      })
  }

  const handleReset = (event) => {
    dispatch(getTables());

    dispatch(initAllState());
    dispatch(initAllUtility());
    dispatch(initAllTable());      
  }
  const handleRunQuery = (event) => {
    if(parameters.length>0 && !edited) {
      setParamDialog(true);
    }
    else {
      /*
      const selectFields = queryData.selectFields;
      let fromTable='', joinFields = [], sortFields = [], filterFields=[], joinArray;
      queryData.relationFields.forEach((item, index) => {
        if(item.LTable.length>0){
          if(index === 0) fromTable = item.LTable[0];
          joinFields.push({
            joinTable: item.RTable[0],
            LFields: item.LFields,
            RFields: item.RFields,
            Operators: item.Operator,
            joinType: item.joinType
          });  
        }
      });
      queryData.sortFields.forEach((item, index) => {
        if(index !== queryData.sortFields.length-1){
          const { data: {field, table, sortType} } = item; 
          sortFields.push({
            field,
            table,
            sortType
          });
        }
      });
  
      const typeAry1 = ['=', '!=', '>', '>=', '<', '<='];
      const typeAry2 = ['=', '!=', 'Like', 'Not Like'];
      queryData.filterFields.forEach((item, index) => {
        if(index !== queryData.filterFields.length-1) {
          const {filterVariant, filterValue, operator, type} = item;
          const { data: { table, field }} = filterVariant[0];
          let typeOperator = typeAry1[operator];
          if(type === "Text") typeOperator = typeAry2[operator];
          let filterText = "";
          if(filterValue.isParam){
            const parameterName = filterValue.parameter;
            parameters.forEach(item => {
              if(item.name===parameterName) filterText = item.value;
            })
          }
          else filterText = filterValue.default;
          filterFields.push({table, field, typeOperator, value: filterText, type});
        }
      })
      joinArray = joinCommand.match(/\bAND\b|\bOR\b/g);
  
      let selectQuery = 'SELECT ';
  
      selectFields.map((item, index) => {
          const { data: { table, field, header_name} } = item;
          selectQuery+=`${table}.${field} as ${header_name}`;
          if(index !== selectFields.length-1)
              selectQuery+=', \n       ';
      })
  
      if(isUnique) fromTable = uniqueTable;
      let fromQuery = `FROM ${fromTable}`;
      let joinQuery = '';
      const joinTypeArray = ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'];
      const OperatorTypeArray = ['=', '!=']
  
      joinFields.map((item) => {
          const {joinTable, LFields, RFields, Operators, joinType} = item;
          let joinString = `${joinTypeArray[joinType]} ${joinTable} ON`
          for(let i=0;i<LFields.length;i++) {
              joinString += ` ${LFields[i]}${OperatorTypeArray[Operators[i]]}${RFields[i]}`
              if(i !== LFields.length-1){
                  joinString += ' AND';
              }
          }
  
          joinQuery+=`${joinString}\n`;
      });
      let sortQuery = "ORDER BY";
      sortFields.forEach((item, index) => {
          sortQuery += ` ${item.table}.${item.field} ${item.sortType}`
          if(index !== sortFields.length-1) sortQuery+=',';
      })
  
      let whereQuery = 'WHERE ';
  
      filterFields.map((item, index) => {
        if(index>0){
          whereQuery+= `\n      ${joinArray[index-1]} `
        }
  
        let valueString = item.value;
        if(item.type === 'Text') valueString = `'${item.value}'`;
        let condition = ''; 
        if(item.typeOperator === 'Like' || item.typeOperator === 'Not Like') {
          condition = item.table+'.'+item.field+' '+item.typeOperator.toUpperCase()+' '+`'%${item.value}%'`;
        }
        else
          condition = item.table+'.'+item.field+item.typeOperator+valueString;
        whereQuery += condition;
      })
  
      let query='';
  
      let groupByQuery = 'GROUP BY';
      let cSelectQuery = 'SELECT ';
      
      if(isCrossTab && crosstabColumns.length>0) {
        crosstabColumns.forEach((item, index) => {
          const { data: {table, field, header_name}} = item;
          let string = ' '+table+'.'+field+ 'as ' +header_name;
          if(index < crosstabColumns.length-1) 
            groupByQuery+=string;
          if(index < crosstabColumns.length-2){
            groupByQuery+=',';
          }
        });
        // crosstabSelectors.map((item, index) => {
        //   const { data: { table, field } } = item;
        //   cSelectQuery+=`${table}.${field}`;
        //   if(index !== selectFields.length-1)
        //   cSelectQuery+=',\n       ';
        // });
        crosstabColumns.map((item, index) => {
          if(item.id !== 'none'){
            const { data: { table, field, header_name} } = item;
            cSelectQuery+=`${table}.${field} as ${header_name}`;
            if(index !== selectFields.length-1)
              cSelectQuery+=',\n       ';  
          }
        });
        crosstabValues.map((item) => {
          const { data: { table, field } } = item;
          let string = `COUNT(${table}.${field})`
          cSelectQuery+=string;
        })
      }
      
      if(selectFields.length>0){
        if(isCrossTab) query +=cSelectQuery +'\n';
        else query+=selectQuery+'\n';
      } 
      if(fromTable) query+=fromQuery+'\n';
      if(joinFields.length>0) query+=joinQuery;
      if(filterFields.length>0) query+=whereQuery+'\n';
      if(!isCrossTab && sortFields.length>0) query+=sortQuery+'\n';
      if(isCrossTab && crosstabColumns.length>1) query+=groupByQuery+'\n';
  
      if(edited || isCrossTab) query = codeSQL;*/
      let query = codeSQL;
      // console.log("app.jst");
      // console.log(query);
      const queryInfo= {
        query: query
      }

      setIsLoading(true);
      dispatch(runQuery(queryInfo))
        .then(data => {
          dispatch(setSheetOpened(true));
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setOpenModal(true);
        })
    }
  }

 

  const SaveView =  (viewName) => {

    const queryCommand = codeSQL;
    let query=`CREATE VIEW ${viewName} AS ${queryCommand}`; 
    const queryInfo= {
     query: query
   }

   dispatch(runQuery(queryInfo))
   .then(async(data) => {
      setCreateViewDialog(false);
        const res = await TableService.getTables();
        dispatch(addUpdateItem({newArray: res.data}));            
   })
   .catch();

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

  const handleRun = () => {
    const selectFields = queryData.selectFields;
    let fromTable='', joinFields = [], sortFields = [], filterFields=[], joinArray;
    queryData.relationFields.forEach((item, index) => {
      if(item.LTable.length>0){
        if(index === 0) fromTable = item.LTable[0];
        joinFields.push({
          joinTable: item.RTable[0],
          LFields: item.LFields,
          RFields: item.RFields,
          Operators: item.Operator,
          joinType: item.joinType
        });  
      }
    });
    queryData.sortFields.forEach((item, index) => {
      if(index !== queryData.sortFields.length-1){
        const { data: {field, table, sortType} } = item; 
        sortFields.push({
          field,
          table,
          sortType
        });
      }
    });

    const typeAry1 = ['=', '!=', '>', '>=', '<', '<='];
    const typeAry2 = ['=', '!=', 'Like', 'Not Like'];
    queryData.filterFields.forEach((item, index) => {
      if(index !== queryData.filterFields.length-1) {
        const {filterVariant, filterValue, operator, type} = item;
        const { data: { table, field }} = filterVariant[0];
        let typeOperator = typeAry1[operator];
        if(type === "Text") typeOperator = typeAry2[operator];
        let filterText = "";
        if(filterValue.isParam){
          const parameterName = filterValue.parameter;
          parameters.forEach(item => {
            if(item.name===parameterName) filterText = item.value;
          })
        }
        else filterText = filterValue.default;
        filterFields.push({table, field, typeOperator, value: filterText, type});
      }
    })
    joinArray = joinCommand.match(/\bAND\b|\bOR\b/g);

    let selectQuery = 'SELECT ';

    selectFields.map((item, index) => {
        const { data: { table, field, header_name} } = item;
          selectQuery+=`${table}.${field} as ${header_name}`;
        if(index !== selectFields.length-1)
            selectQuery+=', \n       ';
    })

    if(isUnique) fromTable = uniqueTable;
    let fromQuery = `FROM ${fromTable}`;
    let joinQuery = '';
    const joinTypeArray = ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'];
    const OperatorTypeArray = ['=', '!=']

    joinFields.map((item) => {
        const {joinTable, LFields, RFields, Operators, joinType} = item;
        let joinString = `${joinTypeArray[joinType]} ${joinTable} ON`
        for(let i=0;i<LFields.length;i++) {
            joinString += ` ${LFields[i]}${OperatorTypeArray[Operators[i]]}${RFields[i]}`
            if(i !== LFields.length-1){
                joinString += ' AND';
            }
        }

        joinQuery+=`${joinString}\n`;
    });
    let sortQuery = "ORDER BY";
    sortFields.forEach((item, index) => {
        sortQuery += ` ${item.table}.${item.field} ${item.sortType}`
        if(index !== sortFields.length-1) sortQuery+=',';
    })


    let whereQuery = 'WHERE ';

    filterFields.map((item, index) => {
      if(index>0){
        whereQuery+= `\n      ${joinArray[index-1]} `
      }

      let valueString = item.value;
      if(item.type === 'Text') valueString = `'${item.value}'`;
      let condition = ''; 
      if(item.typeOperator === 'Like' || item.typeOperator === 'Not Like') {
        condition = item.table+'.'+item.field+' '+item.typeOperator.toUpperCase()+' '+`'%${item.value}%'`;
      }
      else
        condition = item.table+'.'+item.field+item.typeOperator+valueString;
      whereQuery += condition;
    })

    let query='';

    let groupByQuery = 'GROUP BY';
    let cSelectQuery = 'SELECT ';
    
    if(isCrossTab && crosstabColumns.length>0) {
      crosstabColumns.forEach((item, index) => {
        const { data: {table, field}} = item;
        let string = ' '+table+'.'+field;
        if(index < crosstabColumns.length-1) 
          groupByQuery+=string;
        if(index < crosstabColumns.length-2){
          groupByQuery+=',';
        }
      });
      // crosstabSelectors.map((item, index) => {
      //   const { data: { table, field } } = item;
      //   cSelectQuery+=`${table}.${field}`;
      //   if(index !== selectFields.length-1)
      //   cSelectQuery+=',\n       ';
      // });
      crosstabColumns.map((item, index) => {
        if(item.id !== 'none'){
          const { data: { table, field } } = item;
          cSelectQuery+=`${table}.${field}`;
          if(index !== selectFields.length-1)
            cSelectQuery+=',\n       ';  
        }
      });
      crosstabValues.map((item) => {
        const { data: { table, field } } = item;
        let string = `COUNT(${table}.${field})`
      })
    }
    
    if(selectFields.length>0){
      if(isCrossTab) query +=cSelectQuery +'\n';
      else query+=selectQuery+'\n';
    } 
    if(fromTable) query+=fromQuery+'\n';
    if(joinFields.length>0) query+=joinQuery;
    if(filterFields.length>0) query+=whereQuery+'\n';
    if(!isCrossTab && sortFields.length>0) query+=sortQuery+'\n';
    if(isCrossTab && crosstabColumns.length>1) query+=groupByQuery+'\n';


    if(edited || isCrossTab) query = codeSQL;
    const queryInfo= {
      query: query
    }
    

    setIsLoading(true);
    dispatch(runQuery(queryInfo))
      .then(data => {
        dispatch(setSheetOpened(true));
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setOpenModal(true);
      })
    setParamDialog(false);
  }

  return (    
  <Box sx={{ display: 'flex' }}>
    {isLoading && 
      <div className={classes.loadingBox}>
        <div className={classes.loadingContent}>
          <Oval
            height={50}
            width={50}
            color="#2761c7"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#2761c7"
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
        </div>
      </div>
    }
    <AppBar>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: [1],
        }}
      >
        {/* <Button color="inherit" onClick={handleClickOpen} disabled={!isConnected}>Connect</Button> */}
        <Button variant="inherit"   onClick={handleClickOpen}  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> <SaveIcon />  <Typography style={{ fontSize: 12 }}>Connect</Typography></Button>        
        <Button variant="inherit"   onClick={handleRunQuery}  disabled= {!isConnected} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> <WifiIcon  />  <Typography style={{ fontSize: 12 }}>Run query</Typography></Button>        
        <Button variant="inherit"   onClick={handleReset}  disabled= {!isConnected} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> <RefreshIcon />  <Typography style={{ fontSize: 12 }}>Reset</Typography></Button>        
        <Button variant="inherit"   onClick={handleCreateView}  disabled= {!isConnected} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> <DescriptionIcon />  <Typography style={{ fontSize: 12 }}>Create View</Typography></Button>        

        {/* <Button color="inherit" onClick={handleCreateView}>Create View</Button> */}
      </Toolbar>
    </AppBar>
    <Box component="main" className={classes.boxStyle}>
      <Toolbar />
      <Container spacing={0} sx={{margin: 0, padding: 0}} maxWidth={'1920'}>
        <Grid container>
          <Grid item xs={3}>
            <Item sx={{ height: 600}}>
              <Box className={classes.treeBoxStyle}>
                <Typography>Source</Typography>
                <Button color="inherit" onClick={handleClickAddTables} disabled={!success}>Add table data</Button>
              </Box>
              <Box className={classes.treeHeight}>
                {isTreeOpened && <CustomTreeView />}
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ height: 600}}><MainView/></Item>
          </Grid>
          <Grid item xs={3}>
            <Item sx={{ height: 600, padding: 0}}><PropertyView/></Item>
          </Grid>
        </Grid>
        <Result sx={{position: 'fixed', bottom: 0}}/>
      </Container>
    </Box>
    <NewConnection open={open} handleClose={handleClose} handleConnect={handleConnect}/>
    <Modal open={openModal} param={{title: 'Failed', content: 'An error occured!'}} handleClose={handleCloseModal}/>
    <AddTableDialog open={addDialog} handleAddTableClose={handleAddTableClose} handleTableClose={handleTableClose}/>
    <ParameterDialog open={paramDialog} handleParamClose={handleParamClose} handleRun={handleRun} />
    <CreateViewDialog open={createViewDialog} handleCreateViewClose={handleCreateViewClose} SaveView={SaveView} />

    <Snackbar open={successOpen} sx={{ width: 500 }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={500} onClose={handleSuccessClose}>
      <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
        You connect to the database successfully.
      </Alert>
    </Snackbar>
    <Snackbar open={failOpen} sx={{ width: 500 }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={2000} onClose={handleFailClose}>
      <Alert onClose={handleFailClose} severity="error" sx={{ width: '100%' }}>
        You can't connect to the database.
      </Alert>
    </Snackbar>
  </Box>
  );
}

export default App;
