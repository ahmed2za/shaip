import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Apple,
  Twitter,
} from '@mui/icons-material';
import { signIn } from 'next-auth/react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { authConfig } from '@/config/auth';

interface AuthFormProps {
  mode?: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthForm({ mode = 'login', onSuccess }: AuthFormProps) {
  const [formMode, setFormMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        mode: formMode,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        onSuccess?.();
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      const result = await signIn('google', {
        access_token: response.access_token,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        onSuccess?.();
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول بحساب Google');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('حدث خطأ أثناء تسجيل الدخول بحساب Google'),
  });

  const socialButtons = [
    {
      icon: <Google />,
      label: 'Google',
      onClick: () => handleGoogleLogin(),
      color: '#DB4437',
      disabled: false,
      tooltip: '',
    },
    {
      icon: <Facebook />,
      label: 'Facebook',
      onClick: () => signIn('facebook', { redirect: false }),
      color: '#4267B2',
      disabled: true,
      tooltip: 'قريباً',
    },
    {
      icon: <Apple />,
      label: 'Apple',
      onClick: () => signIn('apple', { redirect: false }),
      color: '#000000',
      disabled: true,
      tooltip: 'قريباً',
    },
  ];

  return (
    <GoogleOAuthProvider clientId={authConfig.google.clientId}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          name="email"
          label="البريد الإلكتروني"
          type="email"
          required
          fullWidth
          autoComplete="email"
          dir="rtl"
        />

        <TextField
          name="password"
          label="كلمة المرور"
          type={showPassword ? 'text' : 'password'}
          required
          fullWidth
          autoComplete={formMode === 'login' ? 'current-password' : 'new-password'}
          dir="rtl"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading
              ? 'جاري التحميل...'
              : formMode === 'login'
              ? 'تسجيل الدخول'
              : 'إنشاء حساب'}
          </Button>
        </motion.div>

        <Divider>
          <Typography variant="body2" color="text.secondary">
            أو
          </Typography>
        </Divider>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            mt: 2,
          }}
        >
          {socialButtons.map((button) => (
            <Tooltip key={button.label} title={button.tooltip}>
              <motion.div
                whileHover={{ scale: button.disabled ? 1 : 1.1 }}
                whileTap={{ scale: button.disabled ? 1 : 0.9 }}
              >
                <IconButton
                  onClick={button.onClick}
                  disabled={button.disabled}
                  sx={{
                    color: button.disabled ? 'text.disabled' : button.color,
                    border: `1px solid ${button.disabled ? 'rgba(0, 0, 0, 0.12)' : button.color}`,
                    borderRadius: 2,
                    width: '100%',
                    height: '100%',
                    minHeight: 48,
                    '&:hover': {
                      backgroundColor: button.disabled ? 'transparent' : `${button.color}20`,
                    },
                    cursor: button.disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {button.icon}
                </IconButton>
              </motion.div>
            </Tooltip>
          ))}
        </Box>

        <Button
          variant="text"
          onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}
          sx={{ mt: 1 }}
        >
          {formMode === 'login'
            ? 'ليس لديك حساب؟ سجل الآن'
            : 'لديك حساب؟ سجل دخول'}
        </Button>
      </Box>
    </GoogleOAuthProvider>
  );
}
