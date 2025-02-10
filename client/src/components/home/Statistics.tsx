import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Business, Star, Group, Visibility } from '@mui/icons-material';

interface StatProps {
  companies: number;
  reviews: number;
  users: number;
  monthlyVisits: number;
}

export default function Statistics({ companies, reviews, users, monthlyVisits }: StatProps) {
  const stats = [
    {
      icon: Business,
      value: companies,
      label: 'شركة مسجلة',
      color: 'primary.main',
    },
    {
      icon: Star,
      value: reviews,
      label: 'تقييم',
      color: 'secondary.main',
    },
    {
      icon: Group,
      value: users,
      label: 'مستخدم نشط',
      color: 'success.main',
    },
    {
      icon: Visibility,
      value: monthlyVisits,
      label: 'زيارة شهرية',
      color: 'info.main',
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 1,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        transition: 'all 0.3s ease-in-out',
                      },
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 40,
                        color: stat.color,
                        mb: 2,
                      }}
                    />
                    <Typography variant="h4" component="div" gutterBottom>
                      <CountUp end={stat.value} duration={2.5} separator="," />
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
