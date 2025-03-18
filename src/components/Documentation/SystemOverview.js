import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

function SystemOverview() {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        System Overview
      </Typography>
      <Typography paragraph>
        The Water Level Monitoring System is designed to provide real-time monitoring and alerts for water levels in Sitio Toto, Cupang Proper, Balanga City.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Features
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Real-time Monitoring" 
            secondary="Continuous monitoring of water levels with automatic updates"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Resident Management" 
            secondary="Add and manage resident information for notifications"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Alert System" 
            secondary="Automated alerts when water levels reach critical thresholds"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Historical Data" 
            secondary="Access to historical water level data and trends"
          />
        </ListItem>
      </List>
    </>
  );
}

export default SystemOverview; 