import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Stack,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('بريد إلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ ما');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          استعادة كلمة المرور
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Alert severity="success">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
          </Alert>
        ) : (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="البريد الإلكتروني"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                dir="rtl"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
              >
                {isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
