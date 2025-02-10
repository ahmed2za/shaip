import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ReviewTrend {
  date: string;
  rating: number;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface SentimentData {
  sentiment: string;
  count: number;
  percentage: number;
}

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

export default function ReviewAnalytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [trends, setTrends] = useState<ReviewTrend[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate trends data
    const mockTrends = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2025, 1, i + 1).toISOString().split('T')[0],
      rating: 3.5 + Math.random(),
      count: Math.floor(Math.random() * 20),
      sentiment: Math.random() > 0.5 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative',
    }));

    // Simulate sentiment analysis
    const mockSentiment = [
      { sentiment: 'إيجابي', count: 150, percentage: 65 },
      { sentiment: 'محايد', count: 50, percentage: 22 },
      { sentiment: 'سلبي', count: 30, percentage: 13 },
    ];

    setTrends(mockTrends);
    setSentimentData(mockSentiment);
  }, [timeRange]);

  return (
    <Box>
      <Stack spacing={3}>
        {/* Time Range Selector */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>الفترة الزمنية</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="الفترة الزمنية"
          >
            <MenuItem value="week">آخر أسبوع</MenuItem>
            <MenuItem value="month">آخر شهر</MenuItem>
            <MenuItem value="quarter">آخر 3 أشهر</MenuItem>
            <MenuItem value="year">آخر سنة</MenuItem>
          </Select>
        </FormControl>

        {/* Rating Trends */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            اتجاهات التقييمات
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rating"
                  name="متوسط التقييم"
                  stroke="#2196F3"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="عدد المراجعات"
                  stroke="#4CAF50"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Sentiment Analysis */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                تحليل المشاعر
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      dataKey="count"
                      nameKey="sentiment"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                توزيع المشاعر
              </Typography>
              <Stack spacing={2}>
                {sentimentData.map((item, index) => (
                  <Box key={item.sentiment}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography>{item.sentiment}</Typography>
                      <Typography>{item.percentage}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: COLORS[index],
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Common Keywords */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            الكلمات الشائعة
          </Typography>
          <Grid container spacing={2}>
            {[
              'خدمة ممتازة',
              'سرعة في التنفيذ',
              'جودة عالية',
              'سعر مناسب',
              'فريق محترف',
              'تجربة رائعة',
              'دعم فني متميز',
              'توصيل سريع',
            ].map((keyword) => (
              <Grid item key={keyword}>
                <Card>
                  <CardContent>
                    <Typography variant="body2">{keyword}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
}
