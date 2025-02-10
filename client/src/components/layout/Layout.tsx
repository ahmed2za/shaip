import { ReactNode } from 'react';
import Head from 'next/head';
import { Box, CircularProgress } from '@mui/material';
import Header from '../header/Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({
  children,
  title = 'مصداقية - منصة التقييمات الأولى في العالم العربي',
  description = 'اكتشف آراء العملاء الحقيقية واتخذ قرارات مستنيرة مع منصة مصداقية - المنصة العربية الأولى لتقييم الشركات والخدمات',
}: LayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1976d2" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="مصداقية" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </>
  );
}
