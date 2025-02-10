import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Hero = () => {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 'bold',
                  mb: 2,
                  textAlign: { xs: 'center', md: 'right' },
                }}
              >
                مصداقية
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  mb: 3,
                  textAlign: { xs: 'center', md: 'right' },
                  color: 'primary.light',
                }}
              >
                منصة التقييمات الأولى في العالم العربي
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  textAlign: { xs: 'center', md: 'right' },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                اكتشف آراء العملاء الحقيقية واتخذ قرارات مستنيرة. ساعد الشركات على النمو من خلال تقييماتك البناءة.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  ابدأ الآن
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  تعرف علينا
                </Button>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '300px', md: '400px' },
                }}
              >
                <Image
                  src="/images/hero-illustration.svg"
                  alt="مصداقية - منصة التقييمات العربية"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
