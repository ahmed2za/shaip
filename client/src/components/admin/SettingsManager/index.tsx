import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

// Mock settings data
const mockSettings = {
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
    moderationEnabled: true,
    maxImagesPerReview: 5,
    profanityFilter: true,
  }
};

interface SettingsManagerProps {
  settings: typeof mockSettings;
  handleChange: (field: string, value: any) => void;
  handleThemeChange: (field: string, value: any) => void;
  handleSave: () => Promise<void>;
  saving: boolean;
  error: string | null;
  success: string | null;
}

export default function SettingsManager({
  settings,
  handleChange,
  handleThemeChange,
  handleSave,
  saving,
  error,
  success
}: SettingsManagerProps) {
  const [localSettings, setSettings] = useState(settings);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleLocalChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocalSave = () => {
    // In development, just show success message
    setLocalSuccess('تم حفظ الإعدادات بنجاح');
    setTimeout(() => setLocalSuccess(null), 3000);
  };

  return (
    <Box>
      {(success || localSuccess) && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success || localSuccess}
        </Alert>
      )}

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
                  value={localSettings.siteName}
                  onChange={(e) => handleLocalChange('siteName', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="وصف الموقع"
                  multiline
                  rows={3}
                  value={localSettings.siteDescription}
                  onChange={(e) => handleLocalChange('siteDescription', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localSettings.maintenanceMode}
                      onChange={(e) => handleLocalChange('maintenanceMode', e.target.checked)}
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
                      checked={localSettings.emailNotifications}
                      onChange={(e) => handleLocalChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="تفعيل الإشعارات البريدية"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={localSettings.analyticsEnabled}
                      onChange={(e) => handleLocalChange('analyticsEnabled', e.target.checked)}
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
              onClick={handleLocalSave}
            >
              حفظ الإعدادات
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
