import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

function EmergencyContacts() {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Emergency Contacts
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Balanga City Disaster Risk Reduction and Management Office (CDRRMO)"
            secondary="Contact: (047) 237-1600 / 0917-813-7108"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Balanga City Fire Station"
            secondary="Contact: (047) 237-3344"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Balanga City Police Station"
            secondary="Contact: (047) 237-3766"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Balanga City Emergency Response Unit"
            secondary="Contact: 911 / (047) 237-1588"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Bataan General Hospital"
            secondary="Contact: (047) 237-3006"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Balanga Rural Health Unit"
            secondary="Contact: (047) 237-1742"
          />
        </ListItem>
      </List>
    </>
  );
}

export default EmergencyContacts; 