import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Switch,
  TextField,
  Button,
  FormControlLabel,
} from '@mui/material';
import AdminLayout from '@/components/admin/Layout';

// Mock settings data
const defaultSettings = {
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
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = React.useState(defaultSettings);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In development, just log the settings
    console.log('Settings saved:', settings);
  };

  return (
    <AdminLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          إعدادات النظام
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  إعدادات عامة
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="اسم الموقع"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="وصف الموقع"
                    multiline
                    rows={3}
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="وضع الصيانة"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  إعدادات الإشعارات
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="تفعيل الإشعارات البريدية"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.analyticsEnabled}
                        onChange={(e) => handleChange('analyticsEnabled', e.target.checked)}
                      />
                    }
                    label="تفعيل التحليلات"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                حفظ الإعدادات
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
