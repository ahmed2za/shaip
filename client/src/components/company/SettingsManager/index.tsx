import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

interface CompanySettings {
  profile: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  notifications: {
    email: boolean;
    reviews: boolean;
    messages: boolean;
  };
  workingHours: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  security: {
    twoFactorAuth: boolean;
    emailNotifications: boolean;
  };
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<CompanySettings>({
    profile: {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    notifications: {
      email: true,
      reviews: true,
      messages: true,
    },
    workingHours: {
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
    },
    security: {
      twoFactorAuth: false,
      emailNotifications: true,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/company/settings');
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch settings');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/company/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccess('تم حفظ الإعدادات بنجاح');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>إعدادات الشركة</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Profile Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                المعلومات الأساسية
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="اسم الشركة"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="وصف الشركة"
                    value={settings.profile.description}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, description: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="العنوان"
                    value={settings.profile.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, address: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value }
                    })}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Social Media Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                مواقع التواصل الاجتماعي
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="فيسبوك"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="تويتر"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="انستغرام"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="لينكد إن"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, linkedin: e.target.value }
                    })}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Working Hours Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                ساعات العمل
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(settings.workingHours).map(([day, hours]) => (
                  <Grid item xs={12} md={6} key={day}>
                    <TextField
                      fullWidth
                      label={day}
                      value={hours}
                      onChange={(e) => setSettings({
                        ...settings,
                        workingHours: { ...settings.workingHours, [day]: e.target.value }
                      })}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                إعدادات الإشعارات
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: e.target.checked }
                        })}
                      />
                    }
                    label="إشعارات البريد الإلكتروني"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.reviews}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, reviews: e.target.checked }
                        })}
                      />
                    }
                    label="إشعارات التقييمات"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.messages}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, messages: e.target.checked }
                        })}
                      />
                    }
                    label="إشعارات الرسائل"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                إعدادات الأمان
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorAuth: e.target.checked }
                        })}
                      />
                    }
                    label="تفعيل المصادقة الثنائية"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.emailNotifications}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, emailNotifications: e.target.checked }
                        })}
                      />
                    }
                    label="إشعارات تسجيل الدخول عبر البريد الإلكتروني"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            size="large"
          >
            حفظ الإعدادات
          </Button>
        </Box>
      </form>
    </Box>
  );
}
