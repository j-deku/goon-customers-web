import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AccessChecking = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7f9',
        color: '#333',
        p: 2,
      }}
    >
      <Box sx={{ width: '50%', mb: 2 }}>
        <LinearProgress />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: '500' }}>
        Verifying your access...
      </Typography>
    </Box>
  );
};

export default AccessChecking;