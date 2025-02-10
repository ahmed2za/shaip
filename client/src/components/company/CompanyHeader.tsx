import { useState } from 'react';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Stack,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface CompanyHeaderProps {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  verified: boolean;
  location: string;
  website: string;
  phone: string;
  email: string;
  categories: string[];
  onAddReview: () => void;
}

export default function CompanyHeader({
  id,
  name,
  description,
  logo,
  coverImage,
  rating,
  verified,
  location,
  website,
  phone,
  email,
  categories,
  onAddReview,
}: CompanyHeaderProps) {
  const { user } = useAuth();
  const [reportDialog, setReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [shareDialog, setShareDialog] = useState(false);

  const handleReport = async () => {
    try {
      // إرسال التقرير إلى الخادم
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: id,
          reason: reportReason,
          userId: user?.id,
        }),
      });

      if (!response.ok) throw new Error('فشل إرسال التقرير');

      toast.success('تم إرسال التقرير بنجاح');
      setReportDialog(false);
      setReportReason('');
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال التقرير');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: name,
        text: description,
        url: window.location.href,
      });
    } catch (error) {
      // إذا لم يكن المتصفح يدعم مشاركة الروابط
      setShareDialog(true);
    }
  };

  return (
    <Card sx={{ mb: 3, overflow: 'visible' }}>
      {/* صورة الغلاف */}
      <Box sx={{ position: 'relative', height: 200 }}>
        <Image
          src={coverImage || '/default-cover.jpg'}
          alt={`${name} cover`}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* معلومات الشركة */}
      <Box sx={{ p: 3, mt: -8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
            <Avatar
              src={logo}
              alt={name}
              sx={{
                width: 120,
                height: 120,
                border: 4,
                borderColor: 'background.paper',
                boxShadow: 2,
              }}
            />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" component="h1">
                  {name}
                </Typography>
                {verified && (
                  <VerifiedIcon color="primary" sx={{ fontSize: 24 }} />
                )}
              </Box>
              <Rating value={rating} precision={0.5} readOnly sx={{ my: 1 }} />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={onAddReview}
                sx={{ mr: 1 }}
              >
                إضافة تقييم
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleShare}
                startIcon={<ShareIcon />}
              >
                مشاركة
              </Button>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {description}
          </Typography>

          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="action" />
                <Typography variant="body2">{location}</Typography>
              </Box>
            )}
            {website && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WebsiteIcon color="action" />
                <Typography
                  variant="body2"
                  component="a"
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                >
                  {website}
                </Typography>
              </Box>
            )}
            {phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="action" />
                <Typography
                  variant="body2"
                  component="a"
                  href={`tel:${phone}`}
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {phone}
                </Typography>
              </Box>
            )}
            {email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="action" />
                <Typography
                  variant="body2"
                  component="a"
                  href={`mailto:${email}`}
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {email}
                </Typography>
              </Box>
            )}
          </Stack>

          {user && (
            <Button
              startIcon={<FlagIcon />}
              color="error"
              onClick={() => setReportDialog(true)}
              sx={{ mt: 2 }}
            >
              الإبلاغ عن مشكلة
            </Button>
          )}
        </motion.div>
      </Box>

      {/* حوار الإبلاغ */}
      <Dialog
        open={reportDialog}
        onClose={() => setReportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>الإبلاغ عن مشكلة</DialogTitle>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialog(false)}>إلغاء</Button>
          <Button onClick={handleReport} color="error" variant="contained">
            إرسال البلاغ
          </Button>
        </DialogActions>
      </Dialog>

      {/* حوار المشاركة */}
      <Dialog
        open={shareDialog}
        onClose={() => setShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>مشاركة الشركة</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="رابط الشركة"
            fullWidth
            value={window.location.href}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>إغلاق</Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('تم نسخ الرابط');
              setShareDialog(false);
            }}
            color="primary"
            variant="contained"
          >
            نسخ الرابط
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
