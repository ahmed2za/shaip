import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from '@/lib/supabase';
import styles from '@/styles/Auth.module.css';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error:', error.message);
        router.push('/login?error=' + encodeURIComponent(error.message));
        return;
      }

      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user exists in our database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error:', userError.message);
        router.push('/login?error=' + encodeURIComponent(userError.message));
        return;
      }

      // If user doesn't exist, create a new profile
      if (!userData) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name || user.email?.split('@')[0],
            role: 'user',
            created_at: new Date().toISOString(),
            total_reviews: 0,
            total_likes: 0,
            total_helpful: 0,
          });

        if (insertError) {
          console.error('Error:', insertError.message);
          router.push('/login?error=' + encodeURIComponent(insertError.message));
          return;
        }
      }

      // Redirect based on role
      if (userData?.role === 'company') {
        router.push('/company/dashboard');
      } else if (userData?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <Box className={styles.container}>
      <Box className={styles.paper} sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={48} sx={{ mb: 4 }} />
        <Typography variant="h6">جاري تسجيل الدخول...</Typography>
      </Box>
    </Box>
  );
}
