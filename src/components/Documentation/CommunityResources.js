import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  WbSunny as WeatherIcon,
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  School as SchoolIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

function CommunityResources() {
  const resources = [
    {
      title: 'Weather Information',
      icon: <WeatherIcon />,
      description: 'Real-time weather updates and forecasts for Balanga City',
      items: [
        'Current weather conditions',
        '24-hour forecast',
        'Rainfall predictions',
        'Tide information',
      ],
      action: 'View Weather',
      link: 'https://weather.com/balanga',
    },
    {
      title: 'Emergency Preparedness',
      icon: <WarningIcon />,
      description: 'Guidelines and resources for emergency situations',
      items: [
        'Emergency kit checklist',
        'Evacuation routes',
        'Emergency contact list',
        'Safety guidelines',
      ],
      action: 'View Guidelines',
      link: '/emergency-preparedness',
    },
    {
      title: 'Healthcare Facilities',
      icon: <HospitalIcon />,
      description: 'Information about local healthcare facilities',
      items: [
        'Bataan General Hospital',
        'Balanga Rural Health Unit',
        'Emergency clinics',
        'Pharmacy locations',
      ],
      action: 'View Facilities',
      link: '/healthcare',
    },
    {
      title: 'Evacuation Centers',
      icon: <SchoolIcon />,
      description: 'List of designated evacuation centers',
      items: [
        'Cupang Elementary School',
        'Balanga City Sports Complex',
        'Balanga Elementary School',
        'City Multi-Purpose Hall',
      ],
      action: 'View Centers',
      link: '/evacuation-centers',
    },
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Community Resources
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Access important information and resources for the community
      </Typography>

      <Grid container spacing={3}>
        {resources.map((resource, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: 'primary.main', mr: 1 }}>
                    {resource.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {resource.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {resource.description}
                </Typography>
                <List dense>
                  {resource.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex}>
                      <ListItemIcon>
                        <InfoIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Divider />
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resource.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default CommunityResources; 