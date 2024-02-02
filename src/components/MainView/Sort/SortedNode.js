import * as React from "react";
import { useDispatch } from 'react-redux';
import { Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { makeStyles  } from 'tss-react/mui';
import { TypeIcon } from "../../common/Tree/TypeIcon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown19, faArrowDown91, faArrowDownAZ, faArrowDownZA } from "@fortawesome/free-solid-svg-icons";
import CloseIcon from '@mui/icons-material/Close';

import { setSortType, removeSortField } from "../../../slices/query";

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      paddingLeft: 8,
      paddingRight: 8,
    },
    itemStyle: {
      padding: 2,
      border: '1px solid #b6b6b6',
      margin: '0px 32px 4px 4px',
      background: 'white',
      minHeight: 32
    },
    paddingText: {
      paddingLeft: 4
    },
    labelGridItem: {
      paddingInlineStart: 8
    },
    borderedBox: {
      backgroundColor: '#eeeeee',
      border: '1px #666666',
      borderStyle: 'dashed',
      padding: 3,
      // margin: 4,
      margin: '0px 32px 0px 4px',
      minHeight: 32
    },
    toggleButton: {
      padding: 4
    },
    removeBox: {
      position: 'absolute',
      right: -24
    },
    iconStyle: {
      width: 12,
      height: 12
    },
    blockStyle: {
      display: 'block',
      position: 'relative'
    },
    noneStyle: {
      display: 'none'
    },
  };
})

export const SortedNode = (props) => {
  const { classes } = useStyles();
  const { id, data } = props.node;
  const dispatch = useDispatch();
  let initalValue = 'ASC';
  if(data.sortType !== undefined) initalValue = data.sortType;
  const [direction, setDirection] = React.useState(initalValue);
  const [visible, setVisible] = React.useState(false);

  const handleDirection = (event, newDirection) => {
    if(newDirection !== null) {
      setDirection(newDirection);
      dispatch(setSortType({id, sortType: newDirection}));
    }
  }

  const showCloseButton = (e) => {
    setVisible(true);
  }

  const hideCloseButton = (e) => {
    setVisible(false);
  }

  const handleClick = (e) => {

    dispatch(removeSortField({id}));
  }
  
  return (
    <Box onMouseOver={showCloseButton} onMouseOut = {hideCloseButton}>
      { id === 'none' &&
        <Box className={classes.borderedBox}>
          <Typography sx={{textAlign:'center'}}>Drag a field here to sort.</Typography>
        </Box>
      }
      { id !== 'none' &&    
        <Box className={classes.itemStyle}>
          <Box className={visible?classes.blockStyle: classes.noneStyle}>
            <Box className={classes.removeBox}>
              <CloseIcon className={classes.iconStyle} onClick={handleClick}/>
            </Box>
          </Box>
          <Box className={classes.boxStyle}>
            <Box>
              <TypeIcon droppable={false} type={data?.type} />
            </Box>
            <Box className={classes.labelGridItem}>
              <Typography variant="body2">{`${props.node.text}`}</Typography>
            </Box>
            <Box>
              <ToggleButtonGroup 
                value={direction}
                exclusive
                onChange={handleDirection}
              >
                <ToggleButton className={classes.toggleButton} value="ASC">
                {
                  data.type === "Number" ? <FontAwesomeIcon icon={faArrowDown19} size="1x" /> : <FontAwesomeIcon icon={faArrowDownAZ} size="1x" />
                }
                </ToggleButton>
                <ToggleButton className={classes.toggleButton} value="DESC">
                {
                  data.type === "Number" ? <FontAwesomeIcon icon={faArrowDown91} size="1x" /> : <FontAwesomeIcon icon={faArrowDownZA} size="1x" />
                }
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      }
    </Box>
  );
};
