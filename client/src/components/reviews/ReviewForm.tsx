import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  companyId: string;
  onSuccess?: () => void;
}

interface FormInputs {
  title: string;
  content: string;
  rating: number;
  pros?: string;
  cons?: string;
  advice?: string;
}

export default function ReviewForm({ companyId, onSuccess }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      rating: 0,
    },
  });

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, companyId }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom align="right">
            أضف تقييمك
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography component="legend">التقييم العام</Typography>
              <Controller
                name="rating"
                control={control}
                rules={{ required: 'التقييم مطلوب' }}
                render={({ field }) => (
                  <Rating
                    {...field}
                    size="large"
                    precision={0.5}
                    onChange={(_, value) => field.onChange(value)}
                  />
                )}
              />
              {errors.rating && (
                <Typography color="error" variant="caption">
                  {errors.rating.message}
                </Typography>
              )}
            </Box>

            <TextField
              {...register('title', { required: 'عنوان التقييم مطلوب' })}
              label="عنوان التقييم"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
              dir="rtl"
            />

            <TextField
              {...register('content', {
                required: 'محتوى التقييم مطلوب',
                minLength: {
                  value: 50,
                  message: 'يجب أن يحتوي التقييم على 50 حرف على الأقل',
                },
              })}
              label="تفاصيل التقييم"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              error={!!errors.content}
              helperText={errors.content?.message}
              dir="rtl"
            />

            <TextField
              {...register('pros')}
              label="الإيجابيات"
              multiline
              rows={2}
              fullWidth
              margin="normal"
              dir="rtl"
            />

            <TextField
              {...register('cons')}
              label="السلبيات"
              multiline
              rows={2}
              fullWidth
              margin="normal"
              dir="rtl"
            />

            <TextField
              {...register('advice')}
              label="نصائح للتحسين"
              multiline
              rows={2}
              fullWidth
              margin="normal"
              dir="rtl"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'نشر التقييم'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
