import { useState } from 'react'
import { Toolbar, Typography, Box, AppBar, Avatar, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from '@mui/lab';
import '../../App.css'

import SnakeController from '../../components/Snake/SnakeController';
import GameOfLife from '../../components/GameOfLife/GameOfLife';
import SoFController from '../../components/SnakeofLife/SoFController';

function StartPage() {
  const headerHeight = 62;
  const ghAvatar = "https://avatars.githubusercontent.com/u/19390975?s=400&u=1358e735334214fa0a842a63d949fe5363e88494&v=4";
  const [activeTab, setActiveTab] = useState("start");

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: string) => {
    setActiveTab(selectedTab);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        color="primary"
        sx={{ height: `${headerHeight}px` }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Avatar
            src={ghAvatar}
            alt="Martin Frisk"
            sx={{ border: "2px solid#222222", marginRight: "20px" }}
          />
          <Typography variant="h5" noWrap component="div">
            mightypirate1
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ 
        width: "1000px", marginTop: `${headerHeight}px`, height: "80vh"
      }}>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
              <Tab label="Disclaimer" value="start" />
              <Tab label="Snake" value="snake" />
              <Tab label="Life" value="life" />
              <Tab label="SnakeLife" value="snake-life" />
            </TabList>
          </Box>
          <TabPanel value="start">
            <Typography>I am not a frontender, as you well can tell!</Typography>
            Either way, there are some toys on the tabs above.
          </TabPanel>
          <TabPanel value="snake"><SnakeController/></TabPanel>
          <TabPanel value="life"><GameOfLife/></TabPanel>
          <TabPanel value="snake-life"><SoFController/></TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default StartPage
