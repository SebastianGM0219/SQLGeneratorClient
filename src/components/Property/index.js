import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { makeStyles  } from 'tss-react/mui';

import SettingsIcon from '@mui/icons-material/Settings';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import TuneIcon from '@mui/icons-material/Tune';
import GridViewIcon from '@mui/icons-material/GridView';

import QueryTab from './QueryTab';
import FilterTab from './FilterTab';
import ParameterTab from './ParameterTab';
import CrossTab from './CrossTab';

import { setCurTab } from '../../slices/utility';
import FieldTab from './FieldTab';

const useStyles = makeStyles()((theme) => {
  return {
    tabStyle: {
      padding: 8,
      minWidth: 40,
      minHeight: 40,
      '&.Mui-selected': {
        borderLeft: 1,
        borderColor: 'red'
      }
    },
    boxStyle: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      height: '100%',
      backgroundColor: 'background.paper'
    }
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      sx={{height: '100%'}}
    >
      {value === index && (
        <Box sx={{height: '100%'}}>
          {children}
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const curTab = useSelector(state => state.utility.currentTab);
  const { classes } = useStyles();
  const [value, setValue] = React.useState(curTab);
  const currentSelectorTab = useSelector(state => state.utility.currentSelectorTab);
  const isConnected = useSelector(state => state.database.success);

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch(setCurTab(newValue));
    setValue(currentSelectorTab);
  };

  React.useEffect(() => {
    setValue(curTab)
  }, [curTab])

  return (
    <Box className={classes.boxStyle}>
      <TabPanel value={value} index={0}>
        <QueryTab/>
      </TabPanel>      
      <TabPanel value={value} index={1}>
        {currentSelectorTab === 0 ? <FieldTab /> : <FilterTab />}
      </TabPanel>    
      <TabPanel value={value} index={2}>
        <ParameterTab/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CrossTab/>
      </TabPanel>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderLeft: 1, borderColor: 'divider', height: '100%' }}
             
      >
        <Tab className={classes.tabStyle} disabled= {!isConnected}   icon={<SettingsIcon/>} {...a11yProps(0)} />
        <Tab className={classes.tabStyle} disabled= {!isConnected}   icon={<RoomPreferencesIcon/>} {...a11yProps(1)} />
        <Tab className={classes.tabStyle} disabled= {!isConnected}   icon={<TuneIcon/>} {...a11yProps(2)} />
        <Tab className={classes.tabStyle} disabled= {!isConnected}    icon={<GridViewIcon/>} {...a11yProps(3)} />
      </Tabs>
    </Box>
  );
}
