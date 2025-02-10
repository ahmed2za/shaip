import { useState } from 'react';
import {
  Box,
  TextField,
  Rating,
  Button,
  Typography,
  Alert,
  IconButton,
  ImageList,
  ImageListItem,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  companyId: string;
  onReviewAdded: () => void;
}

export function ReviewForm({ companyId, onReviewAdded }: ReviewFormProps) {
  const { user } = useAuth();
  const [review, setReview] = useState({
    content: '',
    rating: 0,
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newImages]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageDelete = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('يجب تسجيل الدخول لإضافة مراجعة');
      return;
    }

    if (!review.content.trim()) {
      setError('يرجى كتابة مراجعتك');
      return;
    }

    if (review.rating === 0) {
      setError('يرجى إضافة تقييم');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // رفع الصور إلى التخزين
      const uploadedImages = [];
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('reviews')
          .upload(`${companyId}/${fileName}`, image);

        if (error) throw error;
        const publicUrl = supabase.storage
          .from('reviews')
          .getPublicUrl(`${companyId}/${fileName}`).data.publicUrl;
        uploadedImages.push(publicUrl);
      }

      // إضافة المراجعة
      const { error } = await supabase
        .from('reviews')
        .insert({
          company_id: companyId,
          user_id: user.id,
          content: review.content,
          rating: review.rating,
          images: uploadedImages,
        });

      if (error) throw error;

      setSuccess(true);
      setReview({ content: '', rating: 0 });
      setImages([]);
      setPreviews([]);
      onReviewAdded();

      // إعادة تعيين رسالة النجاح بعد 3 ثواني
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('حدث خطأ أثناء إرسال المراجعة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          تم إضافة مراجعتك بنجاح
        </Alert>
      )}

      <Typography component="legend">تقييمك</Typography>
      <Rating
        value={review.rating}
        onChange={(_, value) => setReview({ ...review, rating: value || 0 })}
        size="large"
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="اكتب مراجعتك هنا..."
        value={review.content}
        onChange={(e) => setReview({ ...review, content: e.target.value })}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          sx={{ mb: 1 }}
        >
          إضافة صور
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleImageSelect}
          />
        </Button>

        {previews.length > 0 && (
          <ImageList cols={3} rowHeight={100} sx={{ mt: 1 }}>
            {previews.map((preview, index) => (
              <ImageListItem key={preview} sx={{ position: 'relative' }}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  loading="lazy"
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleImageDelete(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ minWidth: 120 }}
      >
        {loading ? <CircularProgress size={24} /> : 'إرسال المراجعة'}
      </Button>
    </Box>
  );
}
