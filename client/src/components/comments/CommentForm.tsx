import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { Send as SendIcon, Save as SaveIcon } from '@mui/icons-material';
import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthForm from '../auth/AuthForm';
import AnimatedRating from '../common/AnimatedRating';

interface CommentFormProps {
  entityId: string;
  entityType: string;
  onSubmit: (comment: string, rating: number) => Promise<void>;
}

export default function CommentForm({ entityId, entityType, onSubmit }: CommentFormProps) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft comment if exists
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const res = await fetch(`/api/comments/draft?entityId=${entityId}&entityType=${entityType}`);
        const data = await res.json();
        if (data.content) {
          setComment(data.content);
          if (data.rating) setRating(data.rating);
          toast.success('تم استرجاع مسودة التعليق السابق');
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    };

    if (session) {
      loadDraft();
    }
  }, [session, entityId, entityType]);

  const saveDraft = async () => {
    if (!comment.trim()) return;

    try {
      await fetch('/api/comments/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment,
          rating,
          entityId,
          entityType,
        }),
      });
      toast.success('تم حفظ المسودة');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('حدث خطأ أثناء حفظ المسودة');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    if (!session) {
      // Save comment to localStorage before redirecting to auth
      localStorage.setItem(
        'pendingComment',
        JSON.stringify({
          content: comment,
          rating,
          entityId,
          entityType,
          timestamp: Date.now(),
        })
      );
      setOpenAuthDialog(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(comment, rating);
      setComment('');
      setRating(5);
      // Delete draft after successful submission
      await fetch('/api/comments/draft', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, entityType }),
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('حدث خطأ أثناء نشر التعليق');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            التقييم
          </Typography>
          <AnimatedRating
            value={rating}
            onChange={(value) => setRating(value)}
            size="large"
            readOnly={!session}
          />
        </Box>

        <TextField
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            session
              ? 'اكتب تعليقك هنا...'
              : 'قم بتسجيل الدخول لإضافة تعليق'
          }
          disabled={!session || isSubmitting}
          fullWidth
          dir="rtl"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {session && comment.trim() && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={saveDraft}
                color="primary"
                title="حفظ كمسودة"
              >
                <SaveIcon />
              </IconButton>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!comment.trim() || isSubmitting}
              endIcon={<SendIcon />}
            >
              {isSubmitting ? 'جاري النشر...' : 'نشر التعليق'}
            </Button>
          </motion.div>
        </Box>
      </Paper>

      <Dialog
        open={openAuthDialog}
        onClose={() => setOpenAuthDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          تسجيل الدخول للمتابعة
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            قم بتسجيل الدخول لنشر تعليقك. لن يتم فقدان التعليق الذي كتبته.
          </Typography>
          <AuthForm
            mode="login"
            onSuccess={() => {
              setOpenAuthDialog(false);
              // Restore pending comment after successful login
              const pendingComment = localStorage.getItem('pendingComment');
              if (pendingComment) {
                const { content, rating: savedRating } = JSON.parse(pendingComment);
                setComment(content);
                if (savedRating) setRating(savedRating);
                localStorage.removeItem('pendingComment');
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setOpenAuthDialog(false)}>
            إلغاء
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
