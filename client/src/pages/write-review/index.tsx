import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Paper,
  Rating,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { RateReview, Star } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function WriteReview() {
  const router = useRouter();
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/write-review');
      return;
    }

    if (!rating) {
      setError('يرجى تحديد التقييم');
      return;
    }

    if (review.length < 50) {
      setError('يجب أن يكون التقييم 50 حرفاً على الأقل');
      return;
    }

    // TODO: Submit review logic
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <RateReview sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              اكتب تقييماً
            </Typography>
            <Typography color="text.secondary">
              شارك تجربتك مع الآخرين وساعدهم في اتخاذ قرار أفضل
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography component="legend" gutterBottom>
                ما هو تقييمك؟
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(_, value) => setRating(value)}
                size="large"
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="اكتب تقييمك"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="شارك تجربتك بالتفصيل... ما الذي أعجبك؟ ما الذي لم يعجبك؟"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              نشر التقييم
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
