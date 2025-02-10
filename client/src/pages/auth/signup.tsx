import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Collapse,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business,
  Person,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import styles from '@/styles/Auth.module.css';

interface CompanyData {
  phone: string;
  location: string;
  description: string;
  website: string;
  category: string;
}

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' as 'user' | 'company',
  });
  const [companyData, setCompanyData] = useState<CompanyData>({
    phone: '',
    location: '',
    description: '',
    website: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;

      // 2. Add user data to users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user!.id,
          email: formData.email,
          name: formData.name,
          role: formData.role,
          created_at: new Date().toISOString(),
          total_reviews: 0,
          total_likes: 0,
          total_helpful: 0,
        });

      if (profileError) throw profileError;

      // 3. If company, add company data
      if (formData.role === 'company') {
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            user_id: authData.user!.id,
            name: formData.name,
            phone: companyData.phone,
            location: companyData.location,
            description: companyData.description,
            website: companyData.website,
            category: companyData.category,
            status: 'pending',
            created_at: new Date().toISOString(),
          });

        if (companyError) throw companyError;

        // Send notification to admin
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            type: 'new_company',
            user_id: null, // admin will see all notifications where user_id is null
            title: 'شركة جديدة بحاجة للموافقة',
            content: `تم تسجيل شركة جديدة: ${formData.name}`,
            status: 'unread',
            created_at: new Date().toISOString(),
          });

        if (notificationError) throw notificationError;
      }

      toast.success('تم إنشاء الحساب بنجاح!');

      // 4. Redirect based on account type
      if (formData.role === 'company') {
        router.push('/company/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `حدث خطأ أثناء التسجيل باستخدام ${provider}`);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            إنشاء حساب جديد
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
            قم بإنشاء حساب للوصول إلى جميع الميزات
          </Typography>
        </Box>

        <Box className={styles.socialButtons}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => handleSocialSignup('google')}
            className={styles.googleButton}
          >
            التسجيل باستخدام Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={() => handleSocialSignup('facebook')}
            className={styles.facebookButton}
          >
            التسجيل باستخدام Facebook
          </Button>
        </Box>

        <Box className={styles.dividerContainer}>
          <Divider className={styles.divider}>أو</Divider>
        </Box>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            fullWidth
            label="الاسم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            variant="outlined"
            className={styles.input}
          />

          <TextField
            fullWidth
            type="email"
            label="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            variant="outlined"
            className={styles.input}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="كلمة المرور"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            variant="outlined"
            className={styles.input}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">نوع الحساب</FormLabel>
            <RadioGroup
              row
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'company' })}
            >
              <FormControlLabel 
                value="user" 
                control={<Radio />} 
                label="مستخدم"
                className={`${styles.roleSelect} ${formData.role === 'user' ? styles.roleSelectActive : ''}`}
              />
              <FormControlLabel 
                value="company" 
                control={<Radio />} 
                label="شركة"
                className={`${styles.roleSelect} ${formData.role === 'company' ? styles.roleSelectActive : ''}`}
              />
            </RadioGroup>
          </FormControl>

          <Collapse in={formData.role === 'company'}>
            <Box className={styles.companyFields}>
              <Typography variant="h6" gutterBottom>
                معلومات الشركة
              </Typography>

              <TextField
                fullWidth
                label="رقم الهاتف"
                value={companyData.phone}
                onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                required={formData.role === 'company'}
                variant="outlined"
                className={styles.input}
              />

              <TextField
                fullWidth
                label="الموقع"
                value={companyData.location}
                onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                required={formData.role === 'company'}
                variant="outlined"
                className={styles.input}
              />

              <TextField
                fullWidth
                label="الموقع الإلكتروني"
                value={companyData.website}
                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                variant="outlined"
                className={styles.input}
              />

              <TextField
                fullWidth
                select
                label="التصنيف"
                value={companyData.category}
                onChange={(e) => setCompanyData({ ...companyData, category: e.target.value })}
                required={formData.role === 'company'}
                variant="outlined"
                className={styles.input}
                SelectProps={{
                  native: true,
                }}
              >
                <option value=""></option>
                <option value="restaurants">مطاعم</option>
                <option value="shopping">تسوق</option>
                <option value="cars">سيارات</option>
                <option value="real-estate">عقارات</option>
                <option value="travel">سياحة وسفر</option>
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="وصف الشركة"
                value={companyData.description}
                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                required={formData.role === 'company'}
                variant="outlined"
                className={styles.input}
              />
            </Box>
          </Collapse>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? <CircularProgress size={24} /> : 'إنشاء حساب'}
          </Button>
        </form>

        <Box className={styles.footer}>
          <Typography variant="body1">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className={styles.signupLink}>
              تسجيل الدخول
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
