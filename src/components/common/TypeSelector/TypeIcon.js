import React from "react";
import { makeStyles } from 'tss-react/mui';

import { ReactComponent as BooleanIcon } from './svgs/boolean.svg';
import { ReactComponent as DateIcon } from "./svgs/calendar.svg";
import { ReactComponent as TimeStampIcon } from "./svgs/clock.svg";
import { ReactComponent as DecimalIcon } from "./svgs/decimal.svg";
import { ReactComponent as IntegerIcon } from "./svgs/integer.svg";
import { ReactComponent as TextIcon } from "./svgs/quote.svg";

import clsx from "clsx";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      borderBottom: '1px solid #ddd',
      fontSize: 16,
      cursor: 'pointer'
    },
    checkStyle: {
      fill: 'red',
    },
    iconWhite: {
      color: 'white',
    },
    sWidth: {
      width: 12,
      height: 12
    },
    mWidth: {
      width: 16,
      height: 16
    },
    lWidth: {
      width: 24,
      height: 24
    },
    iconBlue: {
      color: '#158CE2'
    },
    iconBrown: {
      color: '#e1713b'
    },
    iconOrange: {
      color: '#e9d39f'
    },
    iconGreen: {
      color: '#6dafa7'
    },
    iconTlue: {
      color: '#41d7d5'
    },
    iconKey: {
      color: '#006fdd'
    }
  };
})
export const TypeIcon = (props) => {
  const { classes } = useStyles();
  switch (props.type) {
    case "Date":
      return <DateIcon className={clsx(classes.iconWhite, classes.lWidth)}/>;
    case "Decimal":
      return <DecimalIcon className={clsx(classes.iconWhite, classes.lWidth)}/>;
    case "Text":
      return <TextIcon className={clsx(classes.iconWhite, classes.sWidth)}/>;
    case "TimeStamp":
      return <TimeStampIcon className={clsx(classes.iconWhite, classes.mWidth)} />;
    case "Boolean":
      return <BooleanIcon className={clsx(classes.iconWhite, classes.lWidth)}/>;
    case "Integer":
      return <IntegerIcon className={clsx(classes.iconWhite, classes.lWidth)}/>;
      // case "Table":
    //   return <FontAwesomeIcon icon={faTableCells} size="1x" className={classes.iconTlue}/>;
    // case "List":
    //   return <FontAwesomeIcon icon={faTableList} size="1x" className={classes.iconTlue} />;
    // case "Key":
    //   return <FontAwesomeIcon icon={faKey} size="1x" className={classes.iconKey} />;
      default:
      return null;
  }
};
