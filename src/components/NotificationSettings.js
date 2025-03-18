import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import NotificationService from '../services/NotificationService';

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    email: '',
    phoneNumber: '',
    dailyUpdates: false,
    criticalAlerts: true,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load user settings from Firestore
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Load settings from Firestore
      // This is a placeholder for now
      setSettings({
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        email: 'user@example.com',
        phoneNumber: '+1234567890',
        dailyUpdates: true,
        criticalAlerts: true,
      });
    } catch (error) {
      setError('Failed to load notification settings');
    }
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validate email if email notifications are enabled
      if (settings.emailNotifications && !settings.email) {
        setError('Email is required when email notifications are enabled');
        return;
      }

      // Validate phone number if SMS notifications are enabled
      if (settings.smsNotifications && !settings.phoneNumber) {
        setError('Phone number is required when SMS notifications are enabled');
        return;
      }

      // Request push notification permission if enabled
      if (settings.pushNotifications) {
        const granted = await NotificationService.requestPushPermission();
        if (!granted) {
          setError('Push notification permission was denied');
          return;
        }
      }

      // TODO: Save settings to Firestore
      setSuccess('Notification settings saved successfully');
    } catch (error) {
      setError('Failed to save notification settings');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Notification Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage how you receive alerts and updates about water levels
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Notification Channels
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
              }
              label="Email Notifications"
            />
            {settings.emailNotifications && (
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                margin="normal"
                type="email"
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                />
              }
              label="SMS Notifications"
            />
            {settings.smsNotifications && (
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={settings.phoneNumber}
                onChange={handleInputChange}
                margin="normal"
                type="tel"
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
              }
              label="Push Notifications"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dailyUpdates}
                  onChange={() => handleToggle('dailyUpdates')}
                />
              }
              label="Daily Water Level Updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.criticalAlerts}
                  onChange={() => handleToggle('criticalAlerts')}
                />
              }
              label="Critical Level Alerts"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default NotificationSettings; 