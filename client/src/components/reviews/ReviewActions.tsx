import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Flag,
  Share,
  MoreVert,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface ReviewActionsProps {
  reviewId: string;
  userId: string;
  helpful: number;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function ReviewActions({
  reviewId,
  userId,
  helpful,
  onDelete,
  onEdit,
}: ReviewActionsProps) {
  const { data: session } = useSession();
  const [helpfulCount, setHelpfulCount] = useState(helpful);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVote = async (type: 'up' | 'down') => {
    if (!session) {
      // Redirect to login or show login dialog
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!res.ok) throw new Error('Failed to vote');

      if (userVote === type) {
        setHelpfulCount((prev) => prev - 1);
        setUserVote(null);
      } else {
        setHelpfulCount((prev) => prev + (userVote ? 0 : 1));
        setUserVote(type);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });

      if (!res.ok) throw new Error('Failed to report review');

      setReportDialogOpen(false);
      setReportReason('');
    } catch (error) {
      console.error('Error reporting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'مشاركة تقييم',
        text: 'شاهد هذا التقييم على منصة مصداقية',
        url: `${window.location.origin}/reviews/${reviewId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="مفيد">
            <IconButton
              onClick={() => handleVote('up')}
              color={userVote === 'up' ? 'primary' : 'default'}
            >
              <ThumbUp />
            </IconButton>
          </Tooltip>
        </motion.div>

        <Typography variant="body2" color="text.secondary">
          {helpfulCount}
        </Typography>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="غير مفيد">
            <IconButton
              onClick={() => handleVote('down')}
              color={userVote === 'down' ? 'error' : 'default'}
            >
              <ThumbDown />
            </IconButton>
          </Tooltip>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="مشاركة">
            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>
          </Tooltip>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="إبلاغ">
            <IconButton onClick={() => setReportDialogOpen(true)}>
              <Flag />
            </IconButton>
          </Tooltip>
        </motion.div>

        {session?.user?.id === userId && (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={onEdit}>
                <Edit sx={{ mr: 1 }} /> تعديل
              </MenuItem>
              <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
                <Delete sx={{ mr: 1 }} /> حذف
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>إبلاغ عن تقييم</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="سبب الإبلاغ"
            fullWidth
            multiline
            rows={4}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            dir="rtl"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>إلغاء</Button>
          <Button
            onClick={handleReport}
            variant="contained"
            color="error"
            disabled={!reportReason || loading}
          >
            إبلاغ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
