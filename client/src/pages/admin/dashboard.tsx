import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/Layout';
import Analytics from '@/components/admin/Analytics';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalReviews: number;
  pendingReviews: number;
  reportedReviews: number;
  totalCategories: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [status, router]);

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert severity="error">{error}</Alert>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <Alert severity="warning">No data available</Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          لوحة التحكم
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      إجمالي المستخدمين
                    </Typography>
                    <Typography variant="h4">{stats.totalUsers}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <BusinessIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      إجمالي الشركات
                    </Typography>
                    <Typography variant="h4">{stats.totalCompanies}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <StarIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      إجمالي التقييمات
                    </Typography>
                    <Typography variant="h4">{stats.totalReviews}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            التحليلات والإحصائيات
          </Typography>
          <Analytics />
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PendingIcon sx={{ fontSize: 30, color: 'info.main', mr: 1 }} />
                  <Typography variant="h6">
                    التقييمات المعلقة
                  </Typography>
                </Box>
                <Typography variant="h3" gutterBottom>
                  {stats.pendingReviews}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.pendingReviews / stats.totalReviews) * 100} 
                  color="info"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <WarningIcon sx={{ fontSize: 30, color: 'error.main', mr: 1 }} />
                  <Typography variant="h6">
                    التقييمات المبلغ عنها
                  </Typography>
                </Box>
                <Typography variant="h3" gutterBottom>
                  {stats.reportedReviews}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.reportedReviews / stats.totalReviews) * 100} 
                  color="error"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
