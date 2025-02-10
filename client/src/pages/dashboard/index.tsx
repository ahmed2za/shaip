import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Box, Container, Grid, Paper, Typography, Rating, Button } from '@mui/material';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/dateFormat';

interface Review {
  id: string;
  company_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchUserReviews();
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          content,
          created_at,
          companies (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data.map(review => ({
        ...review,
        company_name: review.companies.name
      })));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* ملخص النشاط */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                ملخص النشاط
              </Typography>
              <Typography component="p" variant="h4">
                {reviews.length}
              </Typography>
              <Typography color="text.secondary">
                إجمالي التقييمات
              </Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* التقييمات الأخيرة */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                تقييماتك الأخيرة
              </Typography>
              {loading ? (
                <Typography>جاري التحميل...</Typography>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <Box key={review.id} sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {review.company_name}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                    <Typography variant="subtitle1" gutterBottom>
                      {review.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.content}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {formatDate(review.created_at)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>لم تقم بإضافة أي تقييمات بعد</Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/companies')}
                sx={{ mt: 2 }}
              >
                استكشف الشركات
              </Button>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}
