import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import AdminLayout from '@/components/admin/Layout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ViewStats {
  totalViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  pageViews: { date: string; views: number }[];
}

export default function ViewsPage() {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [viewStats, setViewStats] = useState<ViewStats>({
    totalViews: 0,
    uniqueVisitors: 0,
    averageTimeOnSite: 0,
    bounceRate: 0,
    pageViews: [],
  });

  useEffect(() => {
    const fetchViewStats = async () => {
      try {
        setLoading(true);
        // Simulate API call for testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        setViewStats({
          totalViews: 15000,
          uniqueVisitors: 8500,
          averageTimeOnSite: 300,
          bounceRate: 45,
          pageViews: [
            { date: '2024-02-01', views: 500 },
            { date: '2024-02-02', views: 600 },
            { date: '2024-02-03', views: 750 },
            { date: '2024-02-04', views: 800 },
            { date: '2024-02-05', views: 950 },
            { date: '2024-02-06', views: 1100 },
            { date: '2024-02-07', views: 1300 },
          ],
        });
      } catch (error) {
        console.error('Error fetching view statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViewStats();
  }, [timeRange]);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const chartData = {
    labels: viewStats.pageViews.map((item) => item.date),
    datasets: [
      {
        label: t('admin.views.pageViews'),
        data: viewStats.pageViews.map((item) => item.views),
        fill: true,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 500,
            }}
          >
            {t('admin.views.title', 'إحصائيات المشاهدات')}
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('admin.views.timeRange', 'النطاق الزمني')}</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label={t('admin.views.timeRange', 'النطاق الزمني')}
            >
              <MenuItem value="7d">{t('admin.views.last7Days', 'آخر 7 أيام')}</MenuItem>
              <MenuItem value="30d">{t('admin.views.last30Days', 'آخر 30 يوم')}</MenuItem>
              <MenuItem value="90d">{t('admin.views.last90Days', 'آخر 90 يوم')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                  {t('admin.views.totalViews', 'إجمالي المشاهدات')}
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {viewStats.totalViews.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                  {t('admin.views.uniqueVisitors', 'الزوار الفريدين')}
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {viewStats.uniqueVisitors.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                  {t('admin.views.averageTimeOnSite', 'متوسط وقت التصفح')}
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {Math.round(viewStats.averageTimeOnSite / 60)}م
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                  {t('admin.views.bounceRate', 'معدل الارتداد')}
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {viewStats.bounceRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ height: 400 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
}

export const getStaticProps = async ({ locale = 'ar' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      auth: false, // This will skip authentication
    },
  };
};
