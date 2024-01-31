
import React from "react";

import Functions from '@mui/icons-material/Functions';
import 'rsuite/dist/rsuite.min.css'; 
import { makeStyles  } from 'tss-react/mui';
import { alpha, styled } from '@mui/material/styles';
import { Dropdown, ButtonToolbar, Popover, IconButton } from 'rsuite';
import {ArrowDownIcon, ArrowRight} from '@rsuite/icons';
import PlusIcon from '@rsuite/icons/Plus';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from "react-redux";
// import { setCalcText } from "../../slices/query";

const DropItems = [ 
    <Dropdown.Item eventKey={"cast"}>CAST</Dropdown.Item>, 
    <Dropdown.Item eventKey={"try"}>TRY</Dropdown.Item>, 
    <Dropdown.Item eventKey={"typeof"}>TYPEOF</Dropdown.Item>, 
]; 
const DropStringItems = [ 
  <Dropdown.Item eventKey={"concat"}>CONCAT</Dropdown.Item>, 
  <Dropdown.Item eventKey={"replace"}>REPLACE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"reverse"}>REVERSE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"length"}>LENGTH</Dropdown.Item>, 
  <Dropdown.Item eventKey={"substr"}>SUBSTR</Dropdown.Item>, 
  <Dropdown.Item eventKey={"upper"}>UPPER</Dropdown.Item>, 
  <Dropdown.Item eventKey={"lower"}>LOWER</Dropdown.Item>, 
  <Dropdown.Item eventKey={"split_part"}>SPLIT_PART</Dropdown.Item>, 
  <Dropdown.Item eventKey={"w_right"}>W_RIGHT</Dropdown.Item>, 
  <Dropdown.Item eventKey={"w_left"}>W_LEFT</Dropdown.Item>, 
]; 

const DropConditionalItems = [ 
  <Dropdown.Item eventKey={"if"}>IF</Dropdown.Item>, 
  <Dropdown.Item eventKey={"case"}>CASE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"coalesce"}>COALESCE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"try"}>TRY</Dropdown.Item>, 
  <Dropdown.Item eventKey={"is not null"}>IS NOT NULL</Dropdown.Item>, 
  <Dropdown.Item eventKey={"is null"}>IS NULL</Dropdown.Item>,
]; 

const DropNMathlItems = [ 
  <Dropdown.Item eventKey={"+"}>+</Dropdown.Item>, 
  <Dropdown.Item eventKey={"-"}>-</Dropdown.Item>, 
  <Dropdown.Item eventKey={"/"}>/</Dropdown.Item>, 
  <Dropdown.Item eventKey={"*"}>*</Dropdown.Item>, 
  <Dropdown.Item eventKey={"%"}>%</Dropdown.Item>, 
  <Dropdown.Item eventKey={"abs"}>ABS</Dropdown.Item>, 
  <Dropdown.Item eventKey={"round"}>ROUND</Dropdown.Item>, 
  <Dropdown.Item eventKey={"truncate"}>TRUNCATE</Dropdown.Item>,
]; 

const DropAggregationlItems = [ 
  <Dropdown.Item eventKey={"sum"}>SUM</Dropdown.Item>, 
  <Dropdown.Item eventKey={"avg"}>AVG</Dropdown.Item>, 
  <Dropdown.Item eventKey={"count"}>COUNT</Dropdown.Item>, 
  <Dropdown.Item eventKey={"min"}>MIN</Dropdown.Item>, 
  <Dropdown.Item eventKey={"max"}>MAX</Dropdown.Item>, 
]; 

const DropDateItems= [ 
  <Dropdown.Item eventKey={"day"}>DAY</Dropdown.Item>, 
  <Dropdown.Item eventKey={"month"}>MONTH</Dropdown.Item>, 
  <Dropdown.Item eventKey={"year"}>YEAR</Dropdown.Item>, 
  <Dropdown.Item eventKey={"quarter"}>QUARTER</Dropdown.Item>, 
  <Dropdown.Item eventKey={"current_date"}>CURRENT_DATE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"date"}>DATE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"date_add"}>DATE_ADD</Dropdown.Item>, 
  <Dropdown.Item eventKey={"date_format"}>DATE_FORMAT</Dropdown.Item>,
  <Dropdown.Item eventKey={"date_diff"}>DATE_DIFF</Dropdown.Item>,
  <Dropdown.Item eventKey={"date_now"}>NOW</Dropdown.Item>,
  <Dropdown.Item eventKey={"eomonth"}>EOMONTH</Dropdown.Item>,

]; 

const DropJsonItems= [ 
  <Dropdown.Item eventKey={"JSON_ARRAY_LENGTH"}>DAY</Dropdown.Item>, 
  <Dropdown.Item eventKey={"JSON_ARRAY_GET"}>MONTH</Dropdown.Item>, 
  <Dropdown.Item eventKey={"JSON_EXTRACT"}>YEAR</Dropdown.Item>, 
  <Dropdown.Item eventKey={"JSON_EXTRACT_SCALAR"}>QUARTER</Dropdown.Item>, 
  <Dropdown.Item eventKey={"JSON_FORMAT"}>CURRENT_DATE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"JSON_PARSE"}>DATE</Dropdown.Item>, 
  <Dropdown.Item eventKey={"W_JSON_ARRAY_JOIN"}>DATE_ADD</Dropdown.Item>, 

]; 

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      display: 'flex',
      alignItems: 'center',
      
    },
    sigmaButton: {
      width: 10,
      height:10,
      paddingTop: 3,
      color: 'black',
      borderColor: '#b4b4b4',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      '&:hover': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
    itemStyle: {
      padding: 2,
      border: '1px solid #b6b6b6',
      borderRadius: 4,
      margin: 4,
      background: 'white',
      position: 'relative',
      '&:hover': {
        border: '1px solid #508dc9'
      }
    },
    blockStyle: {
      display: 'block',
      position: 'relative',
    },
    noneStyle: {
      display: 'none'
    },
    closePosition: {
      position: "absolute",
      right: 4
    },
    agreePosition: {
      position: "absolute",
      right: 25
    },

    paddingText: {
      paddingLeft: 4
    },
    iconStyle: {
      width: 12,
      height: 12
    },
    sigmaStyle: {
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontWeight: 'bold' ,
      width: 25,
      height: 25
    },
    labelGridItem: {
      paddingInlineStart: 8
    },
    fontSigma: {
      paddingTop: 3,
      fontFamily: 'Segoe UI',
      fontSize: '18px',
      fontWeight: 'bold'    
    }
  };
})
const renderButton = (props, ref) => {


  return (
    <button
      {...props}
      style={{
        borderColor: '#b4b4b4',
        borderWidth: '1px',
        backgroundColor: 'white',
        position: 'relative',
        padding: '0px 20px 0px 12px'
      }}

    >
      <span style={{fontSize: 20, marginRight: 1}}>Σ</span>
      <span
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-100%) rotate(45deg)',
          width: '0',
          height: '0',
          borderTop: '6px solid transparent',
          borderRight: '6px solid gray', // Changed border color to gray
          borderLeft: '6px solid transparent',
          pointerEvents: 'none'
        }}
      />
    </button>
  );
};

const subButton = (props, ref) => {

  
  return (
    <button
      {...props}
      style={{

        backgroundColor: 'white',
        position: 'relative',
        padding: '10px 20px 10px 12px',
        display: 'flex',
        justifyContent:'space-between',
        alignItems: 'center',
        width: '150px'
      }}
      onMouseEnter={(e) => { e.target.style.backgroundColor = '#E9F3FF' }} // Change background color on mouse enter
      onMouseLeave={(e) => { e.target.style.backgroundColor = 'white' }}
    >
      {props.name}  
      <span
        style={{
          marginTop: '15px',
          transform: 'translateY(-100%) rotate(-45deg)',
          width: '0',
          height: '0',
          borderTop: '6px solid transparent',
          borderRight: '6px solid gray', // Changed border color to gray
          borderLeft: '6px solid transparent',
        }}
      />
    </button>
  );
};
const FuncDropDownMenu = (props) => {
  const {classes} = useStyles();
  const {focusEditor} = props;
  const dispatch = useDispatch();

  const insertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

  const insertSyntax = (command, sub, cursor) => {
    let result = "";
    command.split('\n').forEach((value, index) => {
      if(index !== cursor.row){
        result += value;
      }
      else{
        result += insertAt(value, sub, cursor.column)
      }
      if(index !== command.split('\n').length - 1)
        result += '\n';
    })
    return result
  }
  
  console.log(props.calcCommand, typeof props.calcCommand)

  const handleSelect = (eventKey, event) => {
    focusEditor();
    if(eventKey === "cast")
      props.setCalcCommand(insertSyntax(props.calcCommand, "CAST({'string'} AS integer)", props.cursor))
      // props.setCalcCommand(props.calcCommand+"CAST({'string'} AS integer)");
    if(eventKey === "try")
      props.setCalcCommand(insertSyntax(props.calcCommand, "try({'string'} AS integer)", props.cursor))
    if(eventKey === "typeof")
      props.setCalcCommand(insertSyntax(props.calcCommand, "typeof({'string'} AS integer)", props.cursor))


//STRINGS
   if(eventKey === "concat")
      props.setCalcCommand(insertSyntax(props.calcCommand, "CONCAT( 'string_value_1' , \n      'string_value_2')", props.cursor))
   if(eventKey === "replace")
      props.setCalcCommand(insertSyntax(props.calcCommand, "REPLACE ( 'string_value_1' ,'search', 'replace')", props.cursor))
   if(eventKey === "reverse")
      props.setCalcCommand(insertSyntax(props.calcCommand, "reverse( 'string_value' )", props.cursor))
   if(eventKey === "length")
      props.setCalcCommand(insertSyntax(props.calcCommand, "LENGTH( 'string_value' )", props.cursor)) 
   if(eventKey === "substr")
      props.setCalcCommand(insertSyntax(props.calcCommand, "SUBSTR( 'string_value' , 'start_position' , \n     'length_value' )", props.cursor))
      // props.setCalcCommand(props.calcCommand+"SUBSTR( 'string_value' , 'start_position' , \n     'length_value' )");
   if(eventKey === "trim")
      props.setCalcCommand(insertSyntax(props.calcCommand, "TRIM( 'string_value' )", props.cursor))
      // props.setCalcCommand(props.calcCommand+"TRIM( 'string_value' )");
   if(eventKey === "upper")
      props.setCalcCommand(insertSyntax(props.calcCommand, "UPPER( 'string_value') ", props.cursor))
      // props.setCalcCommand(props.calcCommand+"UPPER( 'string_value') ");
   if(eventKey === "lower")
      props.setCalcCommand(insertSyntax(props.calcCommand, "LOWER( 'string_value') ", props.cursor))
      // props.setCalcCommand(props.calcCommand+"LOWER( 'string_value') ");
   if(eventKey === "split_part")
      props.setCalcCommand(insertSyntax(props.calcCommand, "SPLIT_PART( 'string_value' , 'delimeter', 'index') ", props.cursor))
      // props.setCalcCommand(props.calcCommand+"SPLIT_PART( 'string_value' , 'delimeter', 'index') ");
   if(eventKey === "w_right")
      props.setCalcCommand(insertSyntax(props.calcCommand, "W_RIGHT( 'string_value', 'optional_length_value' )", props.cursor))
      // props.setCalcCommand(props.calcCommand+"W_RIGHT( 'string_value', 'optional_length_value' )");
   if(eventKey === "w_left")
      props.setCalcCommand(insertSyntax(props.calcCommand, "W_LEFT( 'string_value', 'optional_length_value' )", props.cursor))
      // props.setCalcCommand(props.calcCommand+"W_LEFT( 'string_value', 'optional_length_value' )");



//conditional
    if(eventKey === "if")
      props.setCalcCommand(insertSyntax(props.calcCommand, "CASE\n    WHEN 'condition'  THEN result END", props.cursor))
      // props.setCalcCommand(props.calcCommand+"CASE\n    WHEN 'condition'  THEN result END");
    if(eventKey === "case")
    props.setCalcCommand(insertSyntax(props.calcCommand, "CASE\n    WHEN 'condition'  THEN result \nEND", props.cursor))
      // props.setCalcCommand(props.calcCommand+"CASE\n    WHEN 'condition'  THEN result \nEND");
    if(eventKey === "coalesce")
      props.setCalcCommand(insertSyntax(props.calcCommand, "coalesce(value1,value2,value3)", props.cursor))
      // props.setCalcCommand(props.calcCommand+"coalesce(value1,value2,value3)");
    if(eventKey === "is not null")
      props.setCalcCommand(insertSyntax(props.calcCommand, "IS NOT NULL", props.cursor))
      // props.setCalcCommand(props.calcCommand+"IS NOT NULL");
    if(eventKey === "is null")
      props.setCalcCommand(insertSyntax(props.calcCommand, "IS NULL", props.cursor))
      // props.setCalcCommand(props.calcCommand+"IS NULL");

  //     CASE
  //     WHEN condition THEN result
  //     [ WHEN ... ]
  //     [ ELSE result ]
  // END
  //      dispatch(setCalcText({text: "CAST({'string'} AS integer)"}));

  //mathematical
    //+, -, /,*, $, ABS, ROUND, TRUNCATE

    

    if(eventKey === "sum")
      props.setCalcCommand(insertSyntax(props.calcCommand, "SUM()", props.cursor))
      // props.setCalcCommand(props.calcCommand+"SUM()");
    if(eventKey === "avg")
      props.setCalcCommand(insertSyntax(props.calcCommand, "AVG()", props.cursor))
      // props.setCalcCommand(props.calcCommand+"AVG()");
    if(eventKey === "count")
      props.setCalcCommand(insertSyntax(props.calcCommand, "COUNT()", props.cursor))
      // props.setCalcCommand(props.calcCommand+"COUNT()");
    if(eventKey === "min")
      props.setCalcCommand(insertSyntax(props.calcCommand, "MIN()", props.cursor))
      // props.setCalcCommand(props.calcCommand+"MIN()");
    if(eventKey === "max")
      props.setCalcCommand(insertSyntax(props.calcCommand, "MAX()", props.cursor))
      // props.setCalcCommand(props.calcCommand+"MAX()");
    


    if(eventKey === "+")
      props.setCalcCommand(insertSyntax(props.calcCommand, "+", props.cursor))
      // props.setCalcCommand(props.calcCommand+"+");
    if(eventKey === "-")
      props.setCalcCommand(insertSyntax(props.calcCommand, "-", props.cursor))
      // props.setCalcCommand(props.calcCommand+"-");
    if(eventKey === "/")
      props.setCalcCommand(insertSyntax(props.calcCommand, "/", props.cursor))
      // props.setCalcCommand(props.calcCommand+"/");
    if(eventKey === "*")
      props.setCalcCommand(insertSyntax(props.calcCommand, "*", props.cursor))
      // props.setCalcCommand(props.calcCommand+"*");
    if(eventKey === "%")
      props.setCalcCommand(insertSyntax(props.calcCommand, "%", props.cursor))
      // props.setCalcCommand(props.calcCommand+"%");
    if(eventKey === "abs")
      props.setCalcCommand(insertSyntax(props.calcCommand, "abs(number)", props.cursor))
      // props.setCalcCommand(props.calcCommand+"abs(number)");
    if(eventKey === "round")
      props.setCalcCommand(insertSyntax(props.calcCommand, "round(number)", props.cursor))
      // props.setCalcCommand(props.calcCommand+"round(number)");
    if(eventKey === "truncate")
      props.setCalcCommand(insertSyntax(props.calcCommand, "truncate(number)", props.cursor))
      // props.setCalcCommand(props.calcCommand+"truncate(number)");

    //day
    if(eventKey === "day")
      props.setCalcCommand(insertSyntax(props.calcCommand, "DAY('date or timestamps')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"DAY('date or timestamps')");
    if(eventKey === "month")
      props.setCalcCommand(insertSyntax(props.calcCommand, "MONTH('date or timestamps')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"MONTH('date or timestamps')");
    if(eventKey === "year")
      props.setCalcCommand(insertSyntax(props.calcCommand, "YEAR('date or timestamps')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"YEAR('date or timestamps')");
    if(eventKey === "quarter")
      props.setCalcCommand(insertSyntax(props.calcCommand, "QUARTER('date or timestamps')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"QUARTER('date or timestamps')");
    if(eventKey === "current_date")
      props.setCalcCommand(insertSyntax(props.calcCommand, "CURRENT_DATE", props.cursor))
      // props.setCalcCommand(props.calcCommand+"CURRENT_DATE");
    if(eventKey === "date")
      props.setCalcCommand(insertSyntax(props.calcCommand, "DATE('value')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"DATE('value')");
    if(eventKey === "date_add")
      props.setCalcCommand(insertSyntax(props.calcCommand, "DATE_ADD('unit_value', 'value', 'timestamps_value')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"DATE_ADD('unit_value', 'value', 'timestamps_value')");
    if(eventKey === "date_format")
      props.setCalcCommand(insertSyntax(props.calcCommand, "DATE_FORMAT('timestamp', 'format')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"DATE_FORMAT('timestamp', 'format')");
    if(eventKey === "date_diff")
      props.setCalcCommand(insertSyntax(props.calcCommand, "DATE_DIFF('unit_value', 'timestamps_value', 'timestamps_value_2')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"DATE_DIFF('unit_value', 'timestamps_value', 'timestamps_value_2')");
    if(eventKey === "date_now")
      props.setCalcCommand(insertSyntax(props.calcCommand, "NOW()", props.cursor))
      // props.setCalcCommand(props.calcCommand+"NOW()");
    if(eventKey === "eomonth")
      props.setCalcCommand(insertSyntax(props.calcCommand, "EOMONTH('date_value', 'month_number_value')", props.cursor))
      // props.setCalcCommand(props.calcCommand+"EOMONTH('date_value', 'month_number_value')");

    //JSON

    //aggregation

  }
  return (
    <Dropdown  renderToggle={renderButton}  placement="bottomEnd"> 
      <Dropdown renderToggle={(props) => subButton({ ...props, name: "Conversions" })}  trigger="hover"  placement="leftStart"  onSelect={handleSelect}> 
            {DropItems}
      </Dropdown>
      <Dropdown  renderToggle={(props) => subButton({ ...props, name: "Strings" })}  trigger="hover"  placement="leftStart" onSelect={handleSelect}> 
            {DropStringItems} 
      </Dropdown>
      <Dropdown  renderToggle={(props) => subButton({ ...props, name: "Conditional" })}  trigger="hover"  placement="leftStart" onSelect={handleSelect}> 
            {DropConditionalItems}
      </Dropdown>
      <Dropdown  renderToggle={(props) => subButton({ ...props, name: "DateandTime" })}  trigger="hover"  placement="leftStart" onSelect={handleSelect}> 
            {DropDateItems}
      </Dropdown>
      <Dropdown  renderToggle={(props) => subButton({ ...props, name: "Aggregation" })}  trigger="hover"  placement="leftStart" onSelect={handleSelect}> 
            {DropAggregationlItems} 
      </Dropdown>
      <Dropdown  renderToggle={(props) => subButton({ ...props, name: "Mathematical" })}  trigger="hover"  placement="leftStart" onSelect={handleSelect}> 
            {DropNMathlItems} 
      </Dropdown>       
      <Dropdown  renderToggle={(props) => subButton({ ...props, name: "JSON" })}  trigger="hover"  placement="leftStart" onSelect={handleSelect}> 
            {DropJsonItems} 
      </Dropdown>
    </Dropdown> 
)

}

export default FuncDropDownMenu;
