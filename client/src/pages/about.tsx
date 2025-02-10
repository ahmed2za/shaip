import { Security, Speed, Star } from '@mui/icons-material';
import { Box, Container, Grid, Paper, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'تقييمات موثوقة',
    description: 'نضمن مصداقية التقييمات من خلال نظام تحقق متطور',
  },
  {
    icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'حماية البيانات',
    description: 'نحمي خصوصية مستخدمينا وبياناتهم بأحدث تقنيات الأمان',
  },
  {
    icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'سهولة الاستخدام',
    description: 'واجهة سهلة وبسيطة تمكنك من الوصول لما تريد بسرعة',
  },
];

const stats = [
  { number: '500,000+', label: 'تقييم' },
  { number: '50,000+', label: 'مستخدم' },
  { number: '10,000+', label: 'شركة' },
];

const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'primary.main',
          color: 'white',
          pt: 8,
          pb: 12,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, 
              ${alpha('#2196f3', 0.4)} 0%,
              ${alpha('#3f51b5', 0.4)} 100%
            )`,
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120%',
            height: '120%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 2,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 2, fontWeight: 'bold' }}>
                  نحن منصة مصداقية
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 3, opacity: 0.9 }}>
                  المنصة العربية الأولى للتقييمات الموثوقة
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 4, opacity: 0.9 }}>
                  نساعد المستهلكين على اتخاذ قرارات مستنيرة من خلال تقييمات حقيقية وموثوقة،
                  ونساعد الشركات على النمو من خلال التغذية الراجعة البناءة.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
                  <Image
                    src="/images/about-hero.svg"
                    alt="مصداقية - المنصة العربية الأولى للتقييمات"
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

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper', mt: -6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'background.paper',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        mb: 1,
                        fontWeight: 'bold',
                        color: 'primary.main',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              لماذا مصداقية؟
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              نقدم لك منصة متكاملة للتقييمات تجمع بين المصداقية والسهولة والفائدة
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;