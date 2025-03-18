import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Alert,
  Switch,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

function NotificationSettings() {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      address: '',
      dailyUpdates: true,
      weeklyReport: true,
    },
    push: {
      enabled: true,
      waterLevelAlerts: true,
      emergencyAlerts: true,
    },
    sms: {
      enabled: false,
      phone: '',
      criticalAlertsOnly: true,
    }
  });

  const [status, setStatus] = useState({
    success: false,
    error: false,
    message: ''
  });

  useEffect(() => {
    // TODO: Load user's notification settings from Firebase
    // This will be implemented when we add Firebase
  }, [currentUser]);

  const handleChange = (section, field) => (event) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Save settings to Firebase
      setStatus({
        success: true,
        error: false,
        message: 'Notification settings updated successfully!'
      });
    } catch (error) {
      setStatus({
        success: false,
        error: true,
        message: 'Failed to update settings: ' + error.message
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Notification Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage how you receive alerts and updates about water levels
        </Typography>
        <Divider sx={{ my: 2 }} />

        {(status.success || status.error) && (
          <Alert severity={status.error ? "error" : "success"} sx={{ mb: 2 }}>
            {status.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Notifications */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Email Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.enabled}
                  onChange={handleChange('email', 'enabled')}
                  color="primary"
                />
              }
              label="Enable Email Notifications"
            />
            {settings.email.enabled && (
              <Box sx={{ ml: 3, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={settings.email.address}
                  onChange={handleChange('email', 'address')}
                  margin="normal"
                  type="email"
                  required
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.email.dailyUpdates}
                      onChange={handleChange('email', 'dailyUpdates')}
                    />
                  }
                  label="Receive Daily Updates"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.email.weeklyReport}
                      onChange={handleChange('email', 'weeklyReport')}
                    />
                  }
                  label="Receive Weekly Report"
                />
              </Box>
            )}
          </Box>

          {/* Push Notifications */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Push Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.push.enabled}
                  onChange={handleChange('push', 'enabled')}
                  color="primary"
                />
              }
              label="Enable Push Notifications"
            />
            {settings.push.enabled && (
              <Box sx={{ ml: 3, mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.push.waterLevelAlerts}
                      onChange={handleChange('push', 'waterLevelAlerts')}
                    />
                  }
                  label="Water Level Alerts"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.push.emergencyAlerts}
                      onChange={handleChange('push', 'emergencyAlerts')}
                    />
                  }
                  label="Emergency Alerts"
                />
              </Box>
            )}
          </Box>

          {/* SMS Notifications */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              SMS Notifications (For Critical Alerts Only)
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.sms.enabled}
                  onChange={handleChange('sms', 'enabled')}
                  color="primary"
                />
              }
              label="Enable SMS Notifications"
            />
            {settings.sms.enabled && (
              <Box sx={{ ml: 3, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={settings.sms.phone}
                  onChange={handleChange('sms', 'phone')}
                  margin="normal"
                  required
                  helperText="Enter phone number with country code (e.g., +63)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.sms.criticalAlertsOnly}
                      onChange={handleChange('sms', 'criticalAlertsOnly')}
                    />
                  }
                  label="Receive Critical Alerts Only (Recommended)"
                />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Save Settings
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default NotificationSettings; 