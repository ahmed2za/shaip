import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import AdminLayout from '@/components/admin/Layout';
import SettingsManager from '@/components/admin/SettingsManager';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface Settings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  analyticsEnabled: boolean;
  maxUploadSize: number;
  defaultLanguage: string;
  theme: {
    darkMode: boolean;
    primaryColor: string;
    secondaryColor: string;
  };
  security: {
    twoFactorAuth: boolean;
    passwordExpiry: number;
    sessionTimeout: number;
  };
  content: {
    moderationEnabled: boolean;
    maxImagesPerReview: number;
    profanityFilter: boolean;
  };
}

export default function SettingsPage() {
  const { t } = useTranslation('common');
  const [settings, setSettings] = React.useState<Settings>({
    siteName: 'موقع تقييم الشركات',
    siteDescription: 'منصة لتقييم ومراجعة الشركات في المملكة العربية السعودية',
    maintenanceMode: false,
    emailNotifications: true,
    analyticsEnabled: true,
    maxUploadSize: 5,
    defaultLanguage: 'ar',
    theme: {
      darkMode: false,
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
    },
    security: {
      twoFactorAuth: false,
      passwordExpiry: 90,
      sessionTimeout: 30,
    },
    content: {
      moderationEnabled: false,
      maxImagesPerReview: 5,
      profanityFilter: false,
    },
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate loading settings
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleThemeChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('تم حفظ الإعدادات بنجاح');
    } catch (err) {
      setError('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
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
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            color: 'primary.main',
            fontWeight: 500,
          }}
        >
          {t('admin.settings.title', 'إعدادات النظام')}
        </Typography>

        <Paper 
          elevation={2} 
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden',
            p: 3
          }}
        >
          <SettingsManager
            settings={settings}
            handleChange={handleChange}
            handleThemeChange={handleThemeChange}
            handleSave={handleSave}
            saving={saving}
            error={error}
            success={success}
          />
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
