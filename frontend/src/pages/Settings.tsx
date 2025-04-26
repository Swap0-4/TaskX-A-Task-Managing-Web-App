import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Switch, FormControlLabel, Divider, Button, Snackbar, Alert } from '@mui/material';
import { Brightness4, Brightness7, Notifications, Security, Storage, Backup, Save } from '@mui/icons-material';

interface SettingsProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, toggleTheme }) => {
  const [notifications, setNotifications] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [dataSync, setDataSync] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications(event.target.checked);
  };

  const handleAutoSaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSave(event.target.checked);
  };
  
  const handleDataSyncChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataSync(event.target.checked);
  };

  const handleSaveSettings = () => {
    // In a real app, we would save these settings to a backend
    setSnackbarMessage('Settings saved successfully!');
    setSnackbarOpen(true);
  };

  const handleClearData = () => {
    // In a real app, we would clear user data
    setSnackbarMessage('All data has been cleared!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Customize your application preferences
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Brightness4 /> Appearance
          </Typography>
          <Divider sx={{ mb: 2, mt: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Brightness7 color="action" />
            <FormControlLabel
              control={
                <Switch
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  name="themeSwitch"
                  color="primary"
                />
              }
              label="Dark Mode"
            />
            <Brightness4 color="action" />
          </Box>
        </Paper>
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications /> Notifications
          </Typography>
          <Divider sx={{ mb: 2, mt: 1 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={handleNotificationsChange}
                name="notificationsSwitch"
                color="primary"
              />
            }
            label="Enable notifications for due tasks"
          />
        </Paper>
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Storage /> Data Management
          </Typography>
          <Divider sx={{ mb: 2, mt: 1 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSave}
                  onChange={handleAutoSaveChange}
                  name="autoSaveSwitch"
                  color="primary"
                />
              }
              label="Auto-save changes"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={dataSync}
                  onChange={handleDataSyncChange}
                  name="dataSyncSwitch"
                  color="primary"
                />
              }
              label="Sync data across devices"
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Backup />}
              >
                Backup Data
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearData}
              >
                Clear All Data
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security /> Security
          </Typography>
          <Divider sx={{ mb: 2, mt: 1 }} />
          
          <Typography variant="body1">
            Your data is securely stored and encrypted.
          </Typography>
          
          <Button
            variant="text"
            color="primary"
            sx={{ mt: 1 }}
          >
            Change Password
          </Button>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            sx={{ minWidth: 150 }}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
