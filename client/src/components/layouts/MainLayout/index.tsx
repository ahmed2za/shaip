import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
