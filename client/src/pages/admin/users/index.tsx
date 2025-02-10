import AdminLayout from '@/components/admin/Layout';
import UsersTable from '@/components/admin/UserManager/UsersTable';
import {
  Box,
  Paper,
  Typography
} from '@mui/material';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function UsersPage() {
  const { t } = useTranslation('common');

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            color: 'primary.main',
            fontWeight: 500,
          }}
        >
          {t('admin.users.title', 'إدارة المستخدمين')}
        </Typography>

        <Paper 
          elevation={2} 
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <UsersTable onUserUpdate={() => {}} />
        </Paper>
      </Box>
    </AdminLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'ar' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      auth: false, 
    },
  };
};
