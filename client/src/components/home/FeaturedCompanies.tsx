import React from 'react';
import { Box, Container, Typography, Card, CardContent, Rating, Avatar, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// نموذج بيانات الشركات المميزة
const featuredCompanies = [
  {
    id: 1,
    name: 'شركة التقنية المتقدمة',
    logo: '/images/companies/tech-company.png',
    category: 'تقنية المعلومات',
    rating: 4.8,
    reviewCount: 1250,
    description: 'شركة رائدة في مجال تطوير البرمجيات وحلول تكنولوجيا المعلومات',
    verified: true,
  },
  {
    id: 2,
    name: 'متجر الأناقة',
    logo: '/images/companies/fashion-store.png',
    category: 'أزياء وموضة',
    rating: 4.6,
    reviewCount: 850,
    description: 'متجر متخصص في الأزياء العصرية والإكسسوارات الفاخرة',
    verified: true,
  },
  {
    id: 3,
    name: 'مطعم الذواقة',
    logo: '/images/companies/restaurant.png',
    category: 'مطاعم',
    rating: 4.9,
    reviewCount: 2100,
    description: 'أشهى المأكولات العربية والعالمية في أجواء راقية',
    verified: true,
  },
  {
    id: 4,
    name: 'عيادة الصحة المثالية',
    logo: '/images/companies/health-clinic.png',
    category: 'رعاية صحية',
    rating: 4.7,
    reviewCount: 920,
    description: 'خدمات طبية متكاملة بأحدث التقنيات وأمهر الأطباء',
    verified: true,
  },
];

const FeaturedCompanies = () => {
  return (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
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
              }}
            >
              شركات مميزة
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              اكتشف أفضل الشركات المقيمة على منصتنا والتي حازت على ثقة عملائنا
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {featuredCompanies.map((company, index) => (
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
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
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

export default FeaturedCompanies;
