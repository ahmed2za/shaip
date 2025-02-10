import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Box, Container, TextField, Button, Typography, Paper, Grid } from '@mui/material';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل تسجيل الدخول');
      }

      const data = await response.json();
      
      // Save auth data to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
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
            background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)'
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#1a237e',
              mb: 4
            }}
          >
            تسجيل الدخول
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="البريد الإلكتروني"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  dir="rtl"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="كلمة المرور"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  dir="rtl"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    mb: 2,
                    height: 48,
                    fontSize: '1.1rem'
                  }}
                >
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link 
                href="/register"
                style={{
                  color: '#1a237e',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                ليس لديك حساب؟ إنشاء حساب جديد
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
