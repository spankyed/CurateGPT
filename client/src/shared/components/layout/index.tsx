import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import Sidebar from './sidebar';
import SidebarToggleButton from './sidebar/toggle';
import { colors } from '~/shared/styles/theme';
import MenuIcon from '@mui/icons-material/Menu';
import { sidebarOpenAtom } from './sidebar/store';

const height = 'calc(100vh - 65px)';


function Layout(): React.ReactElement {

  return (
    <>
      <AppBar position="sticky" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex' }}>
          <TitleArea />
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: 'flex',
        maxHeight: height,
        transition: 'all 0.5s ease-in-out',
        backgroundColor: colors.main,
      }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <SidebarToggleButton/>
          <Outlet />
        </Box>
      </Box>

      {/* <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, backgroundColor: 'grey.200' }}>
        <MLink href="https://www.youtube.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          YouTube
        </MLink>
        <MLink href="https://www.github.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          GitHub
        </MLink>
        <MLink href="/contact" sx={{ margin: 1 }}>
          Contact
        </MLink>
      </Box> */}
    </>
  );
};

function TitleArea() {
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom); // Assuming you have a setter function for the sidebar open state

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  return (
    <div style={{ display: 'flex', marginLeft: '.4rem', width: '230px'}}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </IconButton>
      <Link color="inherit" to="/calender">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography variant="h6" component="div" sx={{
            borderRadius: '10%', padding: '2px 7px', border: '2px solid white'
          }}>
            AI
          </Typography>
          <Typography variant="h6" component="div" sx={{ padding: '4px 4px' }}>
            Labs
          </Typography>
        </div>
      </Link>
    </div>
  );
}

export default Layout;
