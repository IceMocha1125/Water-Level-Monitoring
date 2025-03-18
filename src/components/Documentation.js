import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Documentation() {
  return (
    <Box>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
        <Typography variant="h6">
          Documentation
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Water Level Monitoring System Documentation
          </Typography>
          <Divider sx={{ my: 2 }} />
          
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

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Frequently Asked Questions (FAQ)
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">
                  What do the different water level alerts mean?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  • Normal (Green): Water level is within safe limits<br />
                  • Warning (Yellow): Water level is rising but not critical<br />
                  • Critical (Red): Water level has reached dangerous levels, evacuation may be necessary
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">
                  How often is the water level data updated?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  The water level data is updated in real-time, with readings taken every 10 seconds from our sensors.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">
                  What should I do when I receive a critical alert?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  1. Stay calm and alert<br />
                  2. Monitor official announcements<br />
                  3. Prepare emergency supplies<br />
                  4. Contact local authorities if needed<br />
                  5. Follow evacuation procedures if instructed
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">
                  Where are the evacuation centers located?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Primary evacuation centers in Balanga City:<br />
                  • Cupang Elementary School<br />
                  • Balanga City Sports Complex<br />
                  • Balanga Elementary School<br />
                  • City Multi-Purpose Hall
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">
                  How can I update my contact information?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  You can update your contact information through the Residents section. Click on the edit button next to your name and update your details. This ensures you receive timely alerts and notifications.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Technical Support
          </Typography>
          <Typography paragraph>
            For technical issues or system support:<br />
            Email: cptolentino1125@gmail.com<br />
            Phone: +639703879142<br />
            Operating Hours: Monday to Sunday, 24/7
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Documentation; 