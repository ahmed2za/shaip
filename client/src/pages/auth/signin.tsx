import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, Apple as AppleIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={50}
                priority
              />
            </Box>

            <Typography component="h1" variant="h5" align="center" gutterBottom>
              تسجيل الدخول
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="البريد الإلكتروني"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="كلمة المرور"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mb: 2 }}
              >
                تسجيل الدخول
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>أو</Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('google')}
                sx={{
                  borderColor: '#4285f4',
                  color: '#4285f4',
                  '&:hover': {
                    borderColor: '#4285f4',
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                  },
                }}
              >
                تسجيل الدخول باستخدام Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('facebook')}
                sx={{
                  borderColor: '#3b5998',
                  color: '#3b5998',
                  '&:hover': {
                    borderColor: '#3b5998',
                    backgroundColor: 'rgba(59, 89, 152, 0.04)',
                  },
                }}
              >
                تسجيل الدخول باستخدام Facebook
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AppleIcon />}
                onClick={() => handleSocialLogin('apple')}
                sx={{
                  borderColor: '#000000',
                  color: '#000000',
                  '&:hover': {
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                تسجيل الدخول باستخدام Apple
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ليس لديك حساب؟{' '}
                <Button
                  color="primary"
                  onClick={() => router.push('/auth/signup')}
                  sx={{ textTransform: 'none' }}
                >
                  إنشاء حساب جديد
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
}
