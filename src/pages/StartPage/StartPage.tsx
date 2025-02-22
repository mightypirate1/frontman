import { useState } from 'react'
import { Divider, Button, Chip, Skeleton, Toolbar, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Drawer, CssBaseline, AppBar, IconButton, Avatar, Tabs, Tab } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MenuIcon from '@mui/icons-material/Menu';
import TabContext from '@mui/lab/TabContext';
import '../../App.css'

import SnakeController from '../../components/Snake/SnakeController';
import Dbg from '../../components/GameOfLife/Dbg';
import { List, Inbox, Mail } from '@mui/icons-material';
import { TabList, TabPanel } from '@mui/lab';

function StartPage() {
  const appBarWidth = 240;
  const headerHeight = 65;
  const ghAvatar = "https://avatars.githubusercontent.com/u/19390975?s=400&u=1358e735334214fa0a842a63d949fe5363e88494&v=4";
  const [activePage, setActivePage] = useState("");
  
  const getContents = (activePage: string) => {
    switch (activePage) {
      case "snake":
        return <SnakeController />;
      case "dbg":
        return <Dbg />;
      default:
        return (
          <Box>
            <Typography variant="h4">Here are some toys!</Typography>
            <Typography variant="h6">Click on the buttons to the left to navigate.</Typography>
          </Box>
        );
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActivePage(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
      <Box component="nav" sx={{ width: "100hh", marginTop: `${headerHeight}px` }}>
        <TabContext value={activePage}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Snake" value="snake" />
              <Tab label="Dbg" value="dbg" />
            </TabList>
          </Box>
          <TabPanel value="snake"><SnakeController/></TabPanel>
          <TabPanel value="dbg"><Dbg/></TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default StartPage
