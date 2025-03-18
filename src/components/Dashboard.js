import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  WaterDrop as WaterDropIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Alarm as AlarmIcon,
} from '@mui/icons-material';
import CupangMap from './CupangMap';

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [alarmEnabled, setAlarmEnabled] = useState(true);

  const handleAlarmToggle = () => {
    setAlarmEnabled(!alarmEnabled);
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%', overflow: 'auto' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome to Cupang Proper Water Level Monitoring System
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }} paragraph>
                Balanga City, Bataan
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 800 }} paragraph>
                This system helps monitor and track water levels in Cupang Proper,
                providing real-time data and alerts to ensure the safety and well-being
                of our community.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                height: 200,
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: alarmEnabled ? 'success.light' : 'error.light',
                transition: 'background-color 0.3s ease',
              }}
            >
              <AlarmIcon sx={{ fontSize: 40, color: 'white', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                Alarm Control
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={alarmEnabled}
                    onChange={handleAlarmToggle}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'white',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'white' }}>
                    {alarmEnabled ? 'Alarm Active' : 'Alarm Disabled'}
                  </Typography>
                }
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                height: 200,
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
                borderRadius: 2,
              }}
              onClick={() => handleCardClick('/monitoring')}
            >
              <WaterDropIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Real-time Monitoring
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track water levels every 10 minutes with our automated monitoring system.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 200,
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
                borderRadius: 2,
              }}
              onClick={() => handleCardClick('/residents')}
            >
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Resident Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage resident information and contact details for emergency alerts.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 200,
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
                borderRadius: 2,
              }}
              onClick={() => handleCardClick('/notifications')}
            >
              <NotificationsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Notifications
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure alerts and notification preferences for water level updates.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                height: 500,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
                Water Level Sensor Location
              </Typography>
              <Box sx={{ flexGrow: 1, width: '100%', height: 'calc(100% - 40px)' }}>
                <CupangMap />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard; 