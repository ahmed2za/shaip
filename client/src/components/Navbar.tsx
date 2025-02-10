import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'transparent',
        boxShadow: 'none'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
            مصداقية
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;