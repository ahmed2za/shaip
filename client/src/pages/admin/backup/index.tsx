import { Box, Typography, Alert } from '@mui/material';
import AdminLayout from '@/components/layouts/AdminLayout';
import BackupManager from '@/components/admin/BackupManager';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function BackupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>جاري التحميل...</Typography>
        </Box>
      </AdminLayout>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <AdminLayout>
        <Alert severity="error">
          غير مصرح لك بالوصول إلى هذه الصفحة
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          إدارة النسخ الاحتياطي
        </Typography>
        <BackupManager />
      </Box>
    </AdminLayout>
  );
}
