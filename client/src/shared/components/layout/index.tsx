import React, { useCallback, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Button, InputBase, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import Sidebar from './sidebar';
import SidebarToggleButton from './sidebar/toggle';
import { colors } from '~/shared/styles/theme';
import MenuIcon from '@mui/icons-material/Menu';
import { sidebarOpenAtom } from './sidebar/store';
import { NotificationManager } from '../notification';
import * as api from '~/shared/api/fetch';
import { isNewUserAtom } from './store';

const height = 'calc(100vh - 65px)';

function Layout(): React.ReactElement {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useAtom(isNewUserAtom);

  const checkIsNewUser = useCallback(async () => {
    const { data: newUserCheck } = await api.checkIsNewUser();
  
    if (newUserCheck) {
      setIsNewUser(true);
      navigate('/onboard');
    }
  }, [])

  useEffect(() => {
    checkIsNewUser()
      .catch(console.error);
  }, [checkIsNewUser]);

  return (
    <>
      <AppBar position="sticky" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TitleArea isNewUser={isNewUser}/>
          {
            !isNewUser && (
              <SearchInput />
            )
          }
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: 'flex',
        maxHeight: height,
        transition: 'all 0.5s ease-in-out',
        backgroundColor: colors.main,
      }}>
        {
          !isNewUser && (
            <Sidebar />
          )
        }
        <Box component="main" sx={{ flexGrow: 1 }}>
          {
            !isNewUser && (
              <SidebarToggleButton/>
            )
          }
          <Outlet />
        </Box>
      </Box>

      <NotificationManager />
    </>
  );
};

function TitleArea({ isNewUser }) {
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom); // Assuming you have a setter function for the sidebar open state

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  return (
    <div style={{ display: 'flex', marginLeft: '.4rem', width: '230px'}}>
      {
        !isNewUser && (
          <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        )
      }

      <Link color="inherit" to={isNewUser ? '/onboard' : "/calendar"}>
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

function SearchInput(){
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryParams = new URLSearchParams({ query: searchValue });
    const searchParamsString = queryParams.toString();
    const newUrl = `/search?${searchParamsString}`;

    navigate(newUrl);
    console.log('Searching for:', searchValue);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex' }}> {/* Form submission */}
      <TextField
          id="query-input"
          label="Keyword"
          value={searchValue}
          size="small"
          onChange={handleSearchInputChange}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          fullWidth/>
      <Button
        type="submit"
        variant="contained"
        color="success"
        sx={{ boxShadow: 'none' }}
      >
        Search
      </Button>
    </form>
  );
}

export default Layout;
