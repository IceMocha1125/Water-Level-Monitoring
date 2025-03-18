import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function VideoTutorials() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState(null);

  const tutorials = [
    {
      title: 'Understanding Water Level Monitoring',
      description: 'Learn about water level monitoring systems and their importance in flood prevention',
      thumbnail: 'https://img.youtube.com/vi/B7UIgOLMYoY/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/B7UIgOLMYoY',
      duration: '8:15',
    },
    {
      title: 'Emergency Response Procedures',
      description: 'Essential steps for handling flood emergencies and evacuation procedures',
      thumbnail: 'https://img.youtube.com/vi/7-iYio9UqDQ/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/7-iYio9UqDQ',
      duration: '5:23',
    },
    {
      title: 'Flood Safety Guidelines',
      description: 'Important safety guidelines and preparedness tips for flood situations',
      thumbnail: 'https://img.youtube.com/vi/A2hgP28MtBU/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/A2hgP28MtBU',
      duration: '4:15',
    },
    {
      title: 'Community Emergency Planning',
      description: 'How communities can prepare and respond to flood emergencies',
      thumbnail: 'https://img.youtube.com/vi/4rpb2w6royI/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/4rpb2w6royI',
      duration: '7:45',
    },
  ];

  const handleOpenVideo = (video) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  const handleCloseVideo = () => {
    setOpenDialog(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Video Tutorials
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Watch step-by-step guides to learn how to use the system effectively
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {tutorials.map((tutorial, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                }
              }}
              onClick={() => handleOpenVideo(tutorial)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={tutorial.thumbnail}
                  alt={tutorial.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      opacity: 1,
                    }
                  }}
                >
                  <PlayCircleOutlineIcon sx={{ fontSize: 60, color: 'white' }} />
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {tutorial.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tutorial.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Duration: {tutorial.duration}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          '& .MuiTypography-root': {
            fontWeight: 'bold',
          }
        }}>
          {selectedVideo?.title}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedVideo && (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseVideo}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default VideoTutorials; 