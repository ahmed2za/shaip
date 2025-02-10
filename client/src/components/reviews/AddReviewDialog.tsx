import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import {
  Image as ImageIcon,
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/storage';
import toast from 'react-hot-toast';

interface AddReviewDialogProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onReviewAdded: () => void;
}

const SUGGESTED_TAGS = [
  'خدمة ممتازة',
  'سعر مناسب',
  'موظفين محترفين',
  'موقع مميز',
  'نظافة',
  'سرعة في الخدمة',
  'تنوع في الخدمات',
  'أسعار مرتفعة',
  'خدمة سيئة',
  'موقع سيء'
];

export default function AddReviewDialog({
  open,
  onClose,
  companyId,
  onReviewAdded,
}: AddReviewDialogProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('يمكنك رفع 5 صور كحد أقصى');
      return;
    }
    
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
      if (!isValid) {
        toast.error(`الملف ${file.name} غير صالح. يجب أن يكون صورة وحجمها أقل من 5 ميجابايت`);
      }
      return isValid;
    });

    setImages(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('يرجى إضافة تقييم');
      return;
    }

    if (!title.trim()) {
      toast.error('يرجى إضافة عنوان للتقييم');
      return;
    }

    if (!content.trim()) {
      toast.error('يرجى إضافة محتوى للتقييم');
      return;
    }

    setUploading(true);

    try {
      // Upload images
      const imageUrls = [];
      for (const image of images) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { path, error } = await storage.uploadFile(
          'review-images',
          `${companyId}/${fileName}`,
          image
        );

        if (error) throw error;
        imageUrls.push(path);
      }

      // Add review
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          company_id: companyId,
          user_id: user?.id,
          rating,
          title,
          content,
          images: imageUrls,
          tags: selectedTags,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      toast.success('تم إضافة تقييمك بنجاح');
      onReviewAdded();
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setRating(null);
    setTitle('');
    setContent('');
    setImages([]);
    setSelectedTags([]);
    onClose();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>إضافة تقييم جديد</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography component="legend">تقييمك العام</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            sx={{ my: 1 }}
          />
        </Box>

        <TextField
          autoFocus
          margin="dense"
          label="عنوان التقييم"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="محتوى التقييم"
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          الوسوم
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {SUGGESTED_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagToggle(tag)}
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>

        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <Button
            variant="outlined"
            startIcon={<AddPhotoIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 5}
          >
            إضافة صور
          </Button>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            يمكنك رفع حتى 5 صور (الحد الأقصى 5 ميجابايت لكل صورة)
          </Typography>
        </Box>

        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {images.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper',
                      }}
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>إلغاء</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading}
        >
          {uploading ? 'جاري النشر...' : 'نشر التقييم'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
