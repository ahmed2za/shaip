import { Box, Typography, Grid, Paper, Rating } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface RatingDistribution {
  [key: number]: number;
}

interface CompanyOverviewProps {
  rating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export default function CompanyOverview({ rating, totalReviews, ratingDistribution }: CompanyOverviewProps) {
  const chartData = [5, 4, 3, 2, 1].map((star) => ({
    star: star.toString(),
    count: ratingDistribution[star] || 0,
    percentage: ((ratingDistribution[star] || 0) / totalReviews) * 100,
  }));

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              {rating.toFixed(1)}
            </Typography>
            <Rating value={rating} readOnly precision={0.1} size="large" sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              بناءً على {totalReviews} تقييم
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis
                  dataKey="star"
                  type="category"
                  tickFormatter={(value) => `${value} نجوم`}
                />
                <Bar
                  dataKey="percentage"
                  fill="#00b67a"
                  radius={[0, 4, 4, 0]}
                  label={{ 
                    position: 'right',
                    formatter: (value: number) => `${value.toFixed(0)}%`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
