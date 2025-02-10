import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم على الأقل'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      // Validate form data
      const validatedData = resetPasswordSchema.parse(formData);

      // Send reset request
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: validatedData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
      }

      toast.success('تم تغيير كلمة المرور بنجاح');
      router.push('/login');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const field = error.path.join('.');
          errors[field] = error.message;
        });
        setFieldErrors(errors);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 4,
          }}
        >
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 4, width: '100%' }}
          >
            <Typography variant="h5" align="center" color="error" gutterBottom>
              رابط غير صالح
            </Typography>
            <Typography align="center">
              يرجى التأكد من استخدام الرابط الصحيح لإعادة تعيين كلمة المرور.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ p: 4, width: '100%' }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            إعادة تعيين كلمة المرور
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="كلمة المرور الجديدة"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                required
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

              <TextField
                fullWidth
                label="تأكيد كلمة المرور"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                required
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'تغيير كلمة المرور'
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
