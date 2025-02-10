import React from 'react';
import { Box } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        bgcolor: 'background.default',
        position: 'relative',
        zIndex: 1
      }}
    />
  );
};

export default Footer;
