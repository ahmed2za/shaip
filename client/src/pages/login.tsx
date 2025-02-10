import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Stack,
} from '@mui/material';
import {
  Google,
  Facebook,
  Apple,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { authConfig } from '@/config/auth';
import { LoginFormData } from '@/types/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      // Redirect based on user role
      if (session.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (session.user.role === 'COMPANY') {
        router.push('/company/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, router]);

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
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
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
        router.push('/dashboard');
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
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: 'sm',
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              تسجيل الدخول
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
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
                autoComplete="current-password"
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
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </motion.div>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link href="/forgot-password" passHref>
                  <Typography
                    component="a"
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    نسيت كلمة المرور؟
                  </Typography>
                </Link>
              </Box>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  أو
                </Typography>
              </Divider>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mb: 3 }}
              >
                {socialButtons.map((button) => (
                  <motion.div
                    key={button.label}
                    whileHover={{ scale: button.disabled ? 1 : 1.1 }}
                    whileTap={{ scale: button.disabled ? 1 : 0.9 }}
                    title={button.tooltip}
                  >
                    <IconButton
                      onClick={button.onClick}
                      disabled={button.disabled}
                      sx={{
                        color: button.disabled ? 'text.disabled' : button.color,
                        border: `1px solid ${
                          button.disabled ? 'rgba(0, 0, 0, 0.12)' : button.color
                        }`,
                        borderRadius: 2,
                        width: 48,
                        height: 48,
                        '&:hover': {
                          backgroundColor: button.disabled
                            ? 'transparent'
                            : `${button.color}20`,
                        },
                        cursor: button.disabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {button.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Stack>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ليس لديك حساب؟{' '}
                  <Link
                    href="/register"
                    style={{
                      color: '#1a237e',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    سجل الآن
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </GoogleOAuthProvider>
  );
}
