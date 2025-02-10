import { Box, Card, Grid, Typography, Rating, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface CompanyStatsProps {
  rating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
  positivePercentage: number;
  responseRate: number;
}

export default function CompanyStats({
  rating,
  totalReviews,
  ratingDistribution,
  positivePercentage,
  responseRate,
}: CompanyStatsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card sx={{ p: 3 }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* التقييم العام */}
        <motion.div variants={item}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="div" color="primary" gutterBottom>
              {rating.toFixed(1)}
            </Typography>
            <Rating value={rating} precision={0.5} readOnly size="large" />
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              بناءً على {totalReviews} تقييم
            </Typography>
          </Box>
        </motion.div>

        {/* توزيع التقييمات */}
        <motion.div variants={item}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              توزيع التقييمات
            </Typography>
            <Grid container spacing={1}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const percentage = (ratingDistribution[stars] || 0) / totalReviews * 100;
                return (
                  <Grid item xs={12} key={stars}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ minWidth: 40 }}>
                        {stars} ★
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: stars > 3 ? 'success.main' : stars > 2 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 50 }}>
                        {percentage.toFixed(1)}%
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </motion.div>

        {/* إحصائيات إضافية */}
        <motion.div variants={item}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="h4" color="success.dark">
                  {positivePercentage}%
                </Typography>
                <Typography variant="body2" color="success.dark">
                  تقييمات إيجابية
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="h4" color="info.dark">
                  {responseRate}%
                </Typography>
                <Typography variant="body2" color="info.dark">
                  معدل الرد
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </motion.div>
    </Card>
  );
}
