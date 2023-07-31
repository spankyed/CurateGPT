// src/components/Layout.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Breadcrumbs, Link, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            AILabs
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Home
            </Link>
            <Link color="inherit" href="/about">
              About
            </Link>
            <Typography color="textPrimary">Current Page</Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: 'calc(100vh - 64px)', marginTop: 8, marginBottom: 8 }}> {/* Adjust the 64px value based on the height of the AppBar */}
        <Outlet />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, backgroundColor: 'grey.200' }}>
        <Link href="https://www.youtube.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          YouTube
        </Link>
        <Link href="https://www.github.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          GitHub
        </Link>
        <Link href="/contact" sx={{ margin: 1 }}>
          Contact
        </Link>
      </Box>
    </>
  );
}

export default Layout;
