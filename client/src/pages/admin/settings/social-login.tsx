import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import AdminLayout from '@/components/admin/Layout';
import { useSession } from 'next-auth/react';

interface SocialLoginConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
}

interface SocialLoginSettings {
  google: SocialLoginConfig;
  facebook: SocialLoginConfig;
  apple: SocialLoginConfig;
}

const SocialLoginSettingsPage = () => {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<SocialLoginSettings>({
    google: { enabled: false, clientId: '', clientSecret: '' },
    facebook: { enabled: false, clientId: '', clientSecret: '' },
    apple: { enabled: false, clientId: '', clientSecret: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/social-login');
      const data = await response.json();
      if (response.ok) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/admin/settings/social-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSuccess('تم حفظ الإعدادات بنجاح');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (provider: keyof SocialLoginSettings, field: keyof SocialLoginConfig, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value,
      },
    }));
  };

  const renderProviderSettings = (provider: keyof SocialLoginSettings, title: string) => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{title}</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings[provider].enabled}
                onChange={(e) => handleChange(provider, 'enabled', e.target.checked)}
                color="primary"
              />
            }
            label={settings[provider].enabled ? 'مفعل' : 'معطل'}
          />
        </Box>

        <TextField
          fullWidth
          label="معرف العميل (Client ID)"
          value={settings[provider].clientId}
          onChange={(e) => handleChange(provider, 'clientId', e.target.value)}
          disabled={!settings[provider].enabled}
          dir="ltr"
        />

        <TextField
          fullWidth
          label="السر (Client Secret)"
          value={settings[provider].clientSecret}
          onChange={(e) => handleChange(provider, 'clientSecret', e.target.value)}
          type="password"
          disabled={!settings[provider].enabled}
          dir="ltr"
        />
      </Stack>
    </Paper>
  );

  return (
    <AdminLayout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            إعدادات تسجيل الدخول بحسابات التواصل الاجتماعي
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {renderProviderSettings('google', 'تسجيل الدخول بحساب Google')}
          {renderProviderSettings('facebook', 'تسجيل الدخول بحساب Facebook')}
          {renderProviderSettings('apple', 'تسجيل الدخول بحساب Apple')}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </AdminLayout>
  );
};

export default SocialLoginSettingsPage;
