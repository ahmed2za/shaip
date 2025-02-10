import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  ThumbUp,
  ThumbDown,
  Flag,
  Edit,
  Delete,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import AnimatedRating from '../common/AnimatedRating';

interface CommentCardProps {
  comment: {
    id: string;
    content: string;
    rating: number;
    createdAt: string;
    user: {
      id: string;
      name: string;
      image: string;
    };
    _count?: {
      likes: number;
      dislikes: number;
    };
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

export default function CommentCard({
  comment,
  onEdit,
  onDelete,
  onReport,
}: CommentCardProps) {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment._count?.likes || 0);
  const [dislikeCount, setDislikeCount] = useState(comment._count?.dislikes || 0);

  const handleLike = async () => {
    if (!session) return;
    if (disliked) {
      setDisliked(false);
      setDislikeCount((prev) => prev - 1);
    }
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    try {
      await fetch(`/api/comments/${comment.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDislike = async () => {
    if (!session) return;
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    }
    setDisliked(!disliked);
    setDislikeCount((prev) => (disliked ? prev - 1 : prev + 1));
    try {
      await fetch(`/api/comments/${comment.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'dislike' }),
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={comment.user.image}
              alt={comment.user.name}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" component="div">
                {comment.user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: ar,
                })}
              </Typography>
            </Box>
            <AnimatedRating value={comment.rating} readOnly size="small" />
            {session?.user?.id === comment.user.id && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
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

          <Typography variant="body1" sx={{ mb: 2 }}>
            {comment.content}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={handleLike}
                color={liked ? 'primary' : 'default'}
                size="small"
              >
                <ThumbUp />
              </IconButton>
            </motion.div>
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={handleDislike}
                color={disliked ? 'error' : 'default'}
                size="small"
              >
                <ThumbDown />
              </IconButton>
            </motion.div>
            <Typography variant="body2" color="text.secondary">
              {dislikeCount}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {session && session.user.id !== comment.user.id && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={onReport} color="warning" size="small">
                  <Flag />
                </IconButton>
              </motion.div>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
