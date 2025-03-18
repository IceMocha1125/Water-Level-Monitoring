import React from 'react';
import { Box } from '@mui/material';

function Logo() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2
      }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="Cupang Proper Logo"
        sx={{
          width: '85%',
          maxWidth: 200,
          height: 'auto',
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
        }}
      />
    </Box>
  );
}

export default Logo; 