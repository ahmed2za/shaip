import { Box, Typography, Alert, CircularProgress, Grid } from '@mui/material';
import AdminLayout from '@/components/layouts/AdminLayout';
import Analytics from '@/components/admin/Analytics';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <AdminLayout>
        <Alert severity="error" sx={{ m: 2 }}>
          غير مصرح لك بالوصول إلى هذه الصفحة
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          التحليلات والإحصائيات
        </Typography>
        <Analytics />
      </Box>
    </AdminLayout>
  );
}
