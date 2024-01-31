import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteRight, faCalendarDays, faList12, faTableCells, faTableList, faKey} from '@fortawesome/free-solid-svg-icons'
import { faClockFour } from '@fortawesome/free-regular-svg-icons';

import { makeStyles } from 'tss-react/mui';

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
    iconView: {
      color: '#FFE300'
    },
    iconKey: {
      color: '#006fdd'
    }
  };
})
export const TypeIcon = (props) => {
  const { classes } = useStyles();
    
  switch (props.fileType) {
    case "Date":
      return <FontAwesomeIcon icon={faCalendarDays} size="1x" className={classes.iconBrown}/>;
    case "Number":
      return <FontAwesomeIcon icon={faList12} size="1x" className={classes.iconGreen}/>;
    case "Text":
      return <FontAwesomeIcon icon={faQuoteRight} size="1x" className={classes.iconBlue}/>;
    case "TimeStamp":
      return <FontAwesomeIcon icon={faClockFour} size="1x" className={classes.iconOrange} />;
    case "Table":
      return <FontAwesomeIcon icon={faTableCells} size="1x" className={classes.iconTlue}/>;
    case "List":
      return <FontAwesomeIcon icon={faTableList} size="1x" className={classes.iconTlue} />;
    case "View":
      return <FontAwesomeIcon icon={faTableList} size="1x" className={classes.iconView} />;
    case "Key":
      return <FontAwesomeIcon icon={faKey} size="1x" className={classes.iconKey} />;
      default:
      return null;
  }
};
