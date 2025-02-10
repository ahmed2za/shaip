import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Paper, Typography, CircularProgress, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء تأكيد البريد الإلكتروني');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">جاري التحقق من البريد الإلكتروني...</Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="success.main" gutterBottom>
              {message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/login')}
              sx={{ mt: 2 }}
            >
              تسجيل الدخول
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="error" gutterBottom>
              {message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/')}
              sx={{ mt: 2 }}
            >
              العودة للرئيسية
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}
