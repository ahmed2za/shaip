import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Rating, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Company {
  id: number;
  name: string;
  logo: string;
  category: string;
  rating: number;
  reviewCount: number;
}

const RecentlyViewed = () => {
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // استرجاع الشركات المزارة مؤخراً من localStorage
    const getRecentlyViewedCompanies = () => {
      try {
        const stored = localStorage.getItem('recentlyViewedCompanies');
        if (stored) {
          const companies = JSON.parse(stored);
          setRecentCompanies(companies.slice(0, 4)); // عرض آخر 4 شركات فقط
        }
      } catch (error) {
        console.error('Error loading recently viewed companies:', error);
      }
    };

    getRecentlyViewedCompanies();

    // إضافة مستمع للتغييرات في localStorage
    window.addEventListener('storage', getRecentlyViewedCompanies);

    return () => {
      window.removeEventListener('storage', getRecentlyViewedCompanies);
    };
  }, []);

  if (recentCompanies.length === 0) {
    return null; // لا تعرض المكون إذا لم تكن هناك شركات مزارة
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                color: 'text.primary',
                textAlign: 'center',
              }}
            >
              آخر الشركات التي زرتها
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'text.secondary',
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              تابع الشركات التي قمت بزيارتها مؤخراً
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {recentCompanies.map((company, index) => (
            <Grid item xs={12} sm={6} md={3} key={company.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/company/${company.id}`} passHref style={{ textDecoration: 'none' }}>
                  <Card
                    className="card"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.50',
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: 'white',
                          border: '1px solid',
                          borderColor: 'grey.200',
                        }}
                      >
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={60}
                          height={60}
                          style={{ objectFit: 'contain' }}
                        />
                      </Avatar>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          mb: 1,
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          color: 'text.primary',
                        }}
                      >
                        {company.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, fontSize: '0.875rem' }}
                      >
                        {company.category}
                      </Typography>

                      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Rating
                          value={company.rating}
                          precision={0.1}
                          readOnly
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#00b67a',
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ mr: 1, color: 'text.secondary', fontSize: '0.875rem' }}
                        >
                          {company.rating}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {company.reviewCount} تقييم
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RecentlyViewed;
