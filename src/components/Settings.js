import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Alert,
} from '@mui/material';
import {
  DarkMode,
  Notifications,
  Language,
  Refresh,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: true,
    autoRefresh: true,
    refreshInterval: 10,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (setting, value) => {
    if (setting === 'darkMode') {
      toggleDarkMode();
    } else if (setting === 'language') {
      toggleLanguage(value);
    } else {
      setSettings(prev => ({
        ...prev,
        [setting]: value
      }));
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('settings')}
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('settingsUpdated')}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <DarkMode sx={{ mr: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => handleChange('darkMode')}
              />
            }
            label={t('darkMode')}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Notifications sx={{ mr: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
              />
            }
            label={t('enableNotifications')}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Language sx={{ mr: 2 }} />
          <FormControl fullWidth>
            <InputLabel>{t('language')}</InputLabel>
            <Select
              value={language}
              label={t('language')}
              onChange={(e) => handleChange('language', e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="tl">Filipino</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Refresh sx={{ mr: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoRefresh}
                onChange={(e) => handleChange('autoRefresh', e.target.checked)}
              />
            }
            label={t('autoRefreshData')}
          />
        </Box>

        {settings.autoRefresh && (
          <Box sx={{ ml: 4, mb: 3 }}>
            <Typography gutterBottom>
              {t('refreshInterval')}
            </Typography>
            <Slider
              value={settings.refreshInterval}
              min={1}
              max={30}
              step={1}
              marks={[
                { value: 1, label: '1m' },
                { value: 10, label: '10m' },
                { value: 20, label: '20m' },
                { value: 30, label: '30m' },
              ]}
              onChange={(e, value) => handleChange('refreshInterval', value)}
            />
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setSettings({
                notifications: true,
                autoRefresh: true,
                refreshInterval: 10,
              });
              if (darkMode) {
                toggleDarkMode();
              }
              if (language !== 'en') {
                toggleLanguage('en');
              }
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }}
          >
            {t('resetToDefaults')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Settings; 