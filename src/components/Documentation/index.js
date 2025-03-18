import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import SystemOverview from './SystemOverview';
import EmergencyContacts from './EmergencyContacts';
import FAQ from './FAQ';
import TechnicalSupport from './TechnicalSupport';
import VideoTutorials from './VideoTutorials';
import InteractiveGuides from './InteractiveGuides';
import CommunityResources from './CommunityResources';

function Documentation() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Help & Support Center
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Find information about the system, emergency contacts, and frequently asked questions
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ '& > *': { mb: 4 } }}>
          <SystemOverview />
          <EmergencyContacts />
          <VideoTutorials />
          <InteractiveGuides />
          <FAQ />
          <CommunityResources />
          <TechnicalSupport />
        </Box>
      </Paper>
    </Box>
  );
}

export default Documentation; 