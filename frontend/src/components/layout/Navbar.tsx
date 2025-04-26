import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Switch, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7, Dashboard, Assignment, Settings, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Assignment sx={{ mr: 1 }} />
          TaskX Pro
        </Typography>

        {isMobile ? (
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/" startIcon={<Dashboard />}>
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/settings" startIcon={<Settings />}>
              Settings
            </Button>
            <Button color="inherit" component={Link} to="/profile" startIcon={<Person />}>
              Profile
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Brightness7 />
              <Switch checked={theme === 'dark'} onChange={toggleTheme} color="default" />
              <Brightness4 />
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
