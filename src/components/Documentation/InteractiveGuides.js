import React, { useState } from 'react';
import {
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function InteractiveGuides() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const steps = [
    {
      label: 'Dashboard Overview',
      content: {
        title: 'Understanding the Dashboard',
        description: 'Learn how to navigate and use the main dashboard features',
        points: [
          'View real-time water level data',
          'Access historical trends',
          'Monitor alert status',
          'Quick access to emergency contacts',
        ],
      },
    },
    {
      label: 'Water Level Monitoring',
      content: {
        title: 'Monitoring Water Levels',
        description: 'Learn how to interpret water level data and alerts',
        points: [
          'Understanding water level readings',
          'Interpreting alert colors',
          'Reading historical data',
          'Using the map view',
        ],
      },
    },
    {
      label: 'Resident Management',
      content: {
        title: 'Managing Residents',
        description: 'Learn how to manage resident information and notifications',
        points: [
          'Adding new residents',
          'Updating contact information',
          'Setting notification preferences',
          'Managing resident groups',
        ],
      },
    },
    {
      label: 'Emergency Procedures',
      content: {
        title: 'Emergency Response',
        description: 'Learn the proper procedures for handling emergency situations',
        points: [
          'Understanding alert levels',
          'Emergency contact procedures',
          'Evacuation protocols',
          'Post-emergency procedures',
        ],
      },
    },
  ];

  const handleNext = () => {
    setCompleted((prev) => ({
      ...prev,
      [activeStep]: true,
    }));
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Interactive Guides
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Follow these step-by-step guides to learn about the system's features
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label} completed={completed[index]}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {steps[activeStep].content.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {steps[activeStep].content.description}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {steps[activeStep].content.points.map((point, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <HelpOutlineIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography>{point}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleReset}
                startIcon={<CheckCircleIcon />}
              >
                Restart Guide
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </>
  );
}

export default InteractiveGuides; 