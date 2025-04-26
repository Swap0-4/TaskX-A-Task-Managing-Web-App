import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, theme, toggleTheme }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
