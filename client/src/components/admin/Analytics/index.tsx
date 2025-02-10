import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  dailyVisits: {
    date: string;
    visits: number;
  }[];
  activeUsers: number;
  totalUsers: number;
  totalCompanies: number;
  totalReviews: number;
  newReviewsToday: number;
  topPages: {
    path: string;
    views: number;
  }[];
  userRegistrations: {
    date: string;
    count: number;
  }[];
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics data');
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('فشل في جلب بيانات التحليلات');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        لا توجد بيانات متاحة
      </Alert>
    );
  }

  const visitChartData: ChartData<'line'> = {
    labels: data.dailyVisits.map(item => 
      format(new Date(item.date), 'dd MMM', { locale: ar })
    ),
    datasets: [
      {
        label: 'الزيارات اليومية',
        data: data.dailyVisits.map(item => item.visits),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const registrationChartData: ChartData<'bar'> = {
    labels: data.userRegistrations.map(item =>
      format(new Date(item.date), 'dd MMM', { locale: ar })
    ),
    datasets: [
      {
        label: 'المستخدمين الجدد',
        data: data.userRegistrations.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  } as const;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                المستخدمين النشطين
              </Typography>
              <Typography variant="h4">
                {data.activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي المستخدمين
              </Typography>
              <Typography variant="h4">
                {data.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي الشركات
              </Typography>
              <Typography variant="h4">
                {data.totalCompanies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                المراجعات الجديدة اليوم
              </Typography>
              <Typography variant="h4">
                {data.newReviewsToday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الزيارات اليومية
              </Typography>
              <Box height={300}>
                <Line data={visitChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الصفحات الأكثر زيارة
              </Typography>
              {data.topPages.map((page, index) => (
                <Box key={index} mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    {page.path}
                  </Typography>
                  <Typography variant="h6">
                    {page.views} مشاهدة
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                المستخدمين الجدد
              </Typography>
              <Box height={300}>
                <Bar
                  data={registrationChartData}
                  options={{
                    ...barChartOptions,
                    plugins: {
                      ...barChartOptions.plugins,
                      title: {
                        display: true,
                        text: 'تسجيلات المستخدمين الجدد',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
