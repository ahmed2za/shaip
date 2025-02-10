import { useEffect, useState } from 'react';
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
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  Google,
  Facebook,
  Apple,
  Visibility,
  VisibilityOff,
  Business,
  Person,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { authConfig } from '@/config/auth';
import { RegisterFormData, Category } from '@/types/auth';
import toast from 'react-hot-toast';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم على الأقل'
    ),
  confirmPassword: z.string(),
  userType: z.enum(['user', 'company']),
  companyDetails: z
    .object({
      name: z.string().min(2, 'اسم الشركة يجب أن يكون أكثر من حرفين'),
      website: z.string().url('الرجاء إدخال رابط صحيح').optional().nullable(),
      category: z.string().min(2, 'الرجاء اختيار تصنيف').optional().nullable(),
    })
    .optional()
    .nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [userType, setUserType] = useState<'user' | 'company'>('user');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
    companyDetails: null,
  });

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
    fetchCategories();
  }, [session, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('حدث خطأ أثناء تحميل التصنيفات');
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (name.startsWith('company.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error for the field being edited
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserType = event.target.value as 'user' | 'company';
    setUserType(newUserType);
    setFormData((prev) => ({
      ...prev,
      userType: newUserType,
      companyDetails: newUserType === 'company' ? { name: '', website: '', category: '' } : null,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      // Validate form data
      const validatedData = registerSchema.parse(formData);

      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...validatedData,
          companyDetails: validatedData.userType === 'company' ? {
            ...validatedData.companyDetails,
            categoryId: validatedData.companyDetails?.category,
          } : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء التسجيل');
      }

      // Sign in after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/dashboard');
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

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const result = await signIn('google', {
          access_token: response.access_token,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        toast.success('تم تسجيل الدخول بنجاح');
        router.push('/dashboard');
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('حدث خطأ أثناء تسجيل الدخول بحساب Google');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول بحساب Google');
    },
  });

  return (
    <GoogleOAuthProvider clientId={authConfig.googleClientId}>
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
              إنشاء حساب جديد
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" gutterBottom>
                    نوع الحساب
                  </Typography>
                  <RadioGroup
                    row
                    name="userType"
                    value={userType}
                    onChange={handleUserTypeChange}
                  >
                    <FormControlLabel
                      value="user"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1 }} />
                          مستخدم
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="company"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Business sx={{ mr: 1 }} />
                          شركة
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  required
                  dir="rtl"
                />

                <TextField
                  fullWidth
                  label="كلمة المرور"
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
                  dir="rtl"
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
                  dir="rtl"
                />

                <Collapse in={userType === 'company'}>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="اسم الشركة"
                      name="company.name"
                      value={formData.companyDetails?.name || ''}
                      onChange={handleInputChange}
                      error={!!fieldErrors['companyDetails.name']}
                      helperText={fieldErrors['companyDetails.name']}
                      required={userType === 'company'}
                      dir="rtl"
                    />

                    <TextField
                      fullWidth
                      label="الموقع الإلكتروني"
                      name="company.website"
                      value={formData.companyDetails?.website || ''}
                      onChange={handleInputChange}
                      error={!!fieldErrors['companyDetails.website']}
                      helperText={fieldErrors['companyDetails.website']}
                      placeholder="https://"
                      dir="rtl"
                    />

                    <TextField
                      select
                      fullWidth
                      label="تصنيف الشركة"
                      name="company.category"
                      value={formData.companyDetails?.category || ''}
                      onChange={handleInputChange}
                      error={!!fieldErrors['companyDetails.category']}
                      helperText={fieldErrors['companyDetails.category']}
                      required={userType === 'company'}
                      dir="rtl"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Collapse>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'إنشاء حساب'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link href="/login" passHref>
                    <Typography
                      component="a"
                      variant="body2"
                      color="primary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      لديك حساب بالفعل؟ تسجيل الدخول
                    </Typography>
                  </Link>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Container>
    </GoogleOAuthProvider>
  );
}
