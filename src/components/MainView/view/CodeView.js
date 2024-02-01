import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from '@uiw/react-textarea-code-editor';

import { makeStyles  } from 'tss-react/mui';
import { setCodeSQL, setEdited } from '../../../slices/utility';
import { runQuery } from '../../../slices/query';
import { UpdateSharp } from '@mui/icons-material';

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

  const queryData = useSelector(state => state.query);
  const joinCommand = useSelector(state => state.query.joinCommand);
  const isCrossTab = useSelector(state => state.utility.isCrossTab);
  const [crossTab, setCrossTab] = React.useState(isCrossTab);
  const [defaultList, setDefaultList] = React.useState('');

  const crosstabSelectors = useSelector(state => state.query.crosstabSelectorFields);
  const crosstabColumns = useSelector(state => state.query.crosstabColumnFields);
  const crosstabValues = useSelector(state => state.query.crosstabValueFields);
  const operatorType = useSelector(state => state.query.operatorType);

  const isUnique = useSelector(state => state.utility.isUnique);
  const uniqueTable = useSelector(state => state.utility.uniqueTable);
  const handleApply = useSelector(state => state.query.selectFields);
  const parameters = useSelector(state => state.utility.parameters);

  const dispatch = useDispatch();

  // function process_date(updatedString) {
  //   let extractedValue = updatedString.match(/DAY\((.*)\)/)[1];
  //   updatedString = updatedString.replace(/DAY\((.*)\)/, `EXTRACT(DAY FROM ${extractedValue})`);
  
  //   // Your other logic for processing the date string goes here
  
  //   return updatedString; // Return the updated string
  // }
  useEffect(() => {
    const selectFields = queryData.selectFields;
    let fromTable='', joinFields = [], sortFields = [], filterFields=[], joinArray;

    let modifiedTable = uniqueTable.replace("None", "");
    //    uniqueTable = modifiedTable;
    
        fromTable = `FROM ${modifiedTable}`;    
    
             
    queryData.relationFields.forEach((item, index) => {
      if(item.LTable.length>0){
        if(index === 0) fromTable = `FROM ${item.LTable[0]}`;
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
        // if(type === "Text") typeOperator = typeAry2[operator];
        // if(filterValue.isParam) {
        //   filterFields.push({table, field, typeOperator, value: '@'+filterValue.parameter, type});
        // } else {
        //   filterFields.push({table, field, typeOperator, value: filterValue.default, type});
        // }
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
        const { data: { table, field, header_name, aggreType,command,dropbox} } = item;
        let prev_name=`${table}.${field}`;
        if(command==null&&command==undefined)
        {
          if(aggreType !== "none")
            prev_name = `${aggreType}( ${prev_name} )`;
          if(header_name !== field)
            selectQuery+=`${prev_name} as "${header_name}" `;
          if(header_name === field)
            selectQuery+=`${prev_name}`;
          if(index !== selectFields.length-1)
            selectQuery += ', \n';
        }
        else
        {
          if(command!=null)
          {          
            let updatedString = command.replace(/{\d+}/g, (match) => {
              const index = parseInt(match.match(/\d+/)[0]);
              return dropbox[index-1].filterVariant[0].data.table+"."+ dropbox[index-1].filterVariant[0].data.field; // Replace {{1}} with data.body
            });
//            updatedString = updatedString.replace(/\s/g, '');
            let regex = /DAY\((.*?)\)/g;
            let matchResult;

            while ((matchResult = regex.exec(updatedString)) !== null) {
              const extractedValue = matchResult[1];
              updatedString = updatedString.replace(matchResult[0], `EXTRACT(DAY FROM ${extractedValue})`);
            }

            matchResult = updatedString.match(/DATE_ADD\((.*)\)/)
            if(matchResult && matchResult[1]) {
              let extractedElements = matchResult[1].split(',');
              if(extractedElements[0]==="'second'" || 
                 extractedElements[0]==="'minute'" || 
                 extractedElements[0]==="'hour'" ||
                 extractedElements[0]==="'day'" || 
                 extractedElements[0]==="'week'" || 
                 extractedElements[0]==="'month'" ||
                 extractedElements[0]==="'quarter'" ||
                 extractedElements[0]==="'year'" ||
                 extractedElements[0]==="'millisecond'") {
                const isDate = !isNaN(Date.parse(extractedElements[2]));                
                if(isDate && extractedElements[0] !== "'millisecond'") 
                  extractedElements[2]= "DATE " + extractedElements[2];
                if(isDate &&extractedElements[0] === "'millisecond'")
                  extractedElements[2]= "TIMESTAMP " + extractedElements[2];                
                if(extractedElements[0] !== "'year'"&& 
                   extractedElements[0] !== "'month'" &&
                   extractedElements[0] !== "'quarter'" &&
                   extractedElements[0] !== "'week'")
                   extractedElements[0] = `${extractedElements[0].replace(/'/g, '')}s`;                
                else
                  extractedElements[0] = `${extractedElements[0].replace(/'/g, '')}`;                                               
                 updatedString = updatedString.replace(/DATE_ADD\((.*)\)/, `${extractedElements[2]} + INTERVAL '${extractedElements[1]} ${extractedElements[0]}'`);
              }
            }

            
            // matchResult = updatedString.match(/DATE_DIFF\((.*?)\)/)
            // if(matchResult && matchResult[1]) {
            //   let extractedElements = matchResult[1].split(',');
            //   updatedString = updatedString.replace(/DATE_DIFF\((.*)\)/, `DATE_PART(${extractedElements[0]}, AGE(${extractedElements[1]},${extractedElements[2]}))`);
            // }

            regex = /DATE_DIFF\((.*?)\)/g;
            while ((matchResult = regex.exec(updatedString)) !== null) {
                const extractedElements = matchResult[1].split(',');
                updatedString = updatedString.replace(matchResult[0], `DATE_PART(${extractedElements[0]}, AGE(${extractedElements[1]},${extractedElements[2]}))`);
            }

            const formatStringMap = {
              '%a': 'Dy',
              '%b': 'Mon',
              '%c': 'MM',
              '%d': 'DD',
              '%e': 'FMDD',
              '%f': 'MS',
              '%H': 'HH24',
              '%h': 'HH12',
              '%I': 'HH12',
              '%i': 'MI',
              '%j': 'DDD',
              '%k': 'HH24',
              '%l': 'HH12',
              '%M': 'Month',
              '%m': 'MM',
              '%p': 'AM',
              '%r': 'HH:MI:SSam',
              '%s': 'SS',
              '%S': 'SS',
              '%T': 'HH24:MI:SS',
              '%v': 'WW',
              '%W': 'Day',
              '%x': 'IYYY',
              '%Y': 'YYYY',
              '%y': 'YY',
              '%%': '%%',
            };

            // matchResult = updatedString.match(/DATE_FORMAT\((.*)\)/)

            // if(matchResult && matchResult[1]) {
            //   let extractedElements = matchResult[1].split(',');
            //   extractedElements[1] = extractedElements[1].replace(/'/g, '');
            //   updatedString = updatedString.replace(/DATE_FORMAT\((.*)\)/, `TO_CHAR(${extractedElements[0]}::DATE, '${formatStringMap[extractedElements[1]]}')`);
            // }
            regex = /DATE_FORMAT\((.*?)\)/g;

            while ((matchResult = regex.exec(updatedString)) !== null) {
              const extractedElements = matchResult[1].split(',');
              extractedElements[1] = extractedElements[1].replace(/'/g, '');
              const newFormat = formatStringMap[extractedElements[1]];
              updatedString = updatedString.replace(matchResult[0], `TO_CHAR(${extractedElements[0]}::DATE, '${newFormat}')`);
            }


            // matchResult = updatedString.match(/EOMONTH\((.*)\)/)

            // if(matchResult && matchResult[1]) {
            //   let extractedElements = matchResult[1].split(',');
            //   extractedElements[1] = extractedElements[1].replace(/'/g, '');
            //   updatedString = updatedString.replace(/EOMONTH\((.*)\)/, `DATE_TRUNC('MONTH', ${extractedElements[0]}::date) + INTERVAL '1 MONTH - 1 DAY' * ${extractedElements[1]} `);
            // }

            regex = /EOMONTH\((.*?)\)/g;

            while ((matchResult = regex.exec(updatedString)) !== null) {
              const extractedElements = matchResult[1].split(',');
              extractedElements[1] = extractedElements[1].replace(/'/g, '');
              updatedString = updatedString.replace(matchResult[0], `DATE_TRUNC('MONTH', ${extractedElements[0]}::date) + INTERVAL '1 MONTH - 1 DAY' * ${extractedElements[1]}`);
            }
            
            // matchResult = updatedString.match(/MONTH\((.*)\)/);            

            // if (matchResult && matchResult[1]) {
            //   updatedString = updatedString.replace(/MONTH\((.*)\)/, `EXTRACT(MONTH FROM ${matchResult[1]})`);
            // }

            regex = /MONTH\((.*?)\)/g;
            
            while ((matchResult = regex.exec(updatedString)) !== null) {
              const extractedValue = matchResult[1];
              updatedString = updatedString.replace(matchResult[0], `EXTRACT(MONTH FROM ${extractedValue})`);
            }

            // matchResult = updatedString.match(/YEAR\((.*)\)/);            

            // if (matchResult && matchResult[1]){
            //   updatedString = updatedString.replace(/YEAR\((.*)\)/, `EXTRACT(YEAR FROM ${matchResult[1]})`);
            // }

            regex = /YEAR\((.*?)\)/g;
            
            while ((matchResult = regex.exec(updatedString)) !== null) {
              const extractedValue = matchResult[1];
              updatedString = updatedString.replace(matchResult[0], `EXTRACT(YEAR FROM ${extractedValue})`);
            }


            // matchResult = updatedString.match(/QUARTER\((.*)\)/);

            // if (matchResult && matchResult[1]){
            //   updatedString = updatedString.replace(/QUARTER\((.*)\)/, `EXTRACT(QUARTER FROM ${matchResult[1]})`);
            // }

            regex = /QUARTER\((.*?)\)/g;
            
            while ((matchResult = regex.exec(updatedString)) !== null) {
              const extractedValue = matchResult[1];
              updatedString = updatedString.replace(matchResult[0], `EXTRACT(QUARTER FROM ${extractedValue})`);
            }
            
            if(updatedString === "")
              updatedString = null;
            updatedString += " as ";
            updatedString += `"${header_name}"`;
            if(index !== selectFields.length-1)
              selectQuery += updatedString+ ", \n";         
            else
              selectQuery += updatedString;
          }         
        }
    })

    let groupByQuery = 'GROUP BY';
    let isGroupBy = 0;

    selectFields.map((item, index) => {
      const { data: {aggreType} } = item;
      if(aggreType !== 'none')
      isGroupBy = 1;
    });

    if(isGroupBy) {
      let cnt=0;
      selectFields.map((item, index) => {
        const { data: { table, field, aggreType} } = item;        
        if (aggreType == 'none' && field!=='None') {
          let string = ' '+table+'.'+field;
          groupByQuery += string;
          groupByQuery += ',';
          cnt++;
        }
      }); 
      groupByQuery = groupByQuery.slice(0, -1);      
      if(cnt === 0)
        isGroupBy = 0;
//      selectQuery += groupByQuery;
    }

    if (isCrossTab) {
      selectQuery = 'SELECT ';
      crosstabSelectors.map((item, index) => {
        const { data: { table, field } } = item;
        selectQuery += `${table}.${field}`;
        selectQuery += ', \n';
        if (crosstabValues[0].id !== 'none') {
          let string = ' '+table+'.'+field;
          if(index < crosstabSelectors.length) 
            groupByQuery += string;
          if(index < crosstabSelectors.length-1)
            groupByQuery += ',';
          if(index == crosstabSelectors.length-1 && crosstabValues[0].id !== 'none')
            groupByQuery += ',';
        }
      });

      if(crosstabColumns[0].id !== 'none'){
        const { data: { table, field } } = crosstabColumns[0];
        selectQuery += `${table}.${field}`;
        selectQuery += ', \n';
        if (crosstabValues[0].id !== 'none') {
          let string = ' '+table+'.'+field;
          groupByQuery += string;
        }
      }

      if(crosstabValues[0].id !== 'none'){
        const { data: { table, field } } = crosstabValues[0];
        selectQuery += `${operatorType.changed}(${table}.${field})`;
      }
    }

//    if(isUnique) fromTable = uniqueTable;

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
    let cSelectQuery = '';
  
    if(selectFields.length>0){
      query += selectQuery+'\n';
    }

    if(fromTable) query+=fromTable+'\n';
    if(joinFields.length>0) query+=joinQuery;
    if(filterFields.length>0) query+=whereQuery+'\n';
    if(isGroupBy)
      query += groupByQuery+'\n';
    if(!isCrossTab && sortFields.length>0) query+=sortQuery+'\n';
    if(isCrossTab && crosstabValues[0].id !== 'none') query+=groupByQuery+'\n';

    dispatch(setCodeSQL(query));    
    if (isCrossTab) {
      if(crosstabColumns[0].id !== 'none'){
        const { data: { table, field } } = crosstabColumns[0];
        cSelectQuery = `SELECT DISTINCT ${field} FROM ${table} ORDER BY 1`;
      }
  
      const queryInfo= {
        query: cSelectQuery
      }

      dispatch(runQuery(queryInfo))
        .then(data => {
          let newParam = '';
          crosstabSelectors.map((item, index) => {
            const { data: { table, field } } = item;
            let type = 'text';
            newParam += `${field} ${type},`;
          })

          let selectQuery = newParam;
          data.payload.rows.forEach((item, index) => {
            const key = Object.keys(item)[0];
            const value = item[key].replaceAll(' ', '_');
            let type = 'text';
            if (typeof(value) == 'string') type = 'text';
            selectQuery += `${value} ${type}`;
            if(index !== data.payload.rows.length-1)
              selectQuery += ',';
          });
          let crosstabQuery = `SELECT * FROM crosstab('${query}', '${cSelectQuery}') AS virtualTable (${selectQuery});`;
          setDefaultList(crosstabQuery);
          dispatch(setEdited(true));
          dispatch(setCodeSQL(crosstabQuery));
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setDefaultList(query);
    }
  }, [operatorType, handleApply]);

  const handleDefaultList = (e) => {
    setDefaultList(e.target.value);
    dispatch(setEdited(true));
    dispatch(setCodeSQL(e.target.value));
  }

  return <CodeEditor 
            value={defaultList} 
            language='sql' 
            onChange={handleDefaultList} 
            padding={15}
            className={classes.editorStyle}
            style={{
              "--color-prettylights-syntax-sublimelinter-gutter-mark": "#DCB862",
            }}
          />
}