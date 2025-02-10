import { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  Stack,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterForm = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('الاسم مطلوب')
        .min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
      email: Yup.string()
        .email('بريد إلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
      password: Yup.string()
        .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم على الأقل'
        )
        .required('كلمة المرور مطلوبة'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'كلمات المرور غير متطابقة')
        .required('تأكيد كلمة المرور مطلوب'),
      acceptTerms: Yup.boolean()
        .oneOf([true], 'يجب الموافقة على الشروط والأحكام'),
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        setIsLoading(true);
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'حدث خطأ أثناء التسجيل');
        }

        // Log in automatically after successful registration
        const result = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء التسجيل');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleSocialLogin = async (provider: string) => {
    try {
      setError('');
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err: any) {
      setError('حدث خطأ أثناء التسجيل بحساب ' + provider);
    }
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="الاسم"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          dir="rtl"
        />

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

        <TextField
          fullWidth
          id="password"
          name="password"
          label="كلمة المرور"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
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

        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="تأكيد كلمة المرور"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          dir="rtl"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="acceptTerms"
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              أوافق على{' '}
              <Link href="/terms" passHref>
                <MuiLink>الشروط والأحكام</MuiLink>
              </Link>
              {' '}و{' '}
              <Link href="/privacy" passHref>
                <MuiLink>سياسة الخصوصية</MuiLink>
              </Link>
            </Typography>
          }
        />
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <Typography color="error" variant="caption">
            {formik.errors.acceptTerms}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
        >
          {isLoading ? 'جاري التسجيل...' : 'إنشاء حساب'}
        </Button>

        <Box sx={{ position: 'relative', my: 2 }}>
          <Divider>
            <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
              أو
            </Typography>
          </Divider>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <IconButton
            onClick={() => handleSocialLogin('google')}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
          </IconButton>

          <IconButton
            onClick={() => handleSocialLogin('facebook')}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <FacebookIcon sx={{ color: '#1877F2' }} />
          </IconButton>

          <IconButton
            onClick={() => handleSocialLogin('apple')}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <AppleIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          لديك حساب بالفعل؟{' '}
          <Link href="/login" passHref>
            <MuiLink>تسجيل الدخول</MuiLink>
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};

export default RegisterForm;
