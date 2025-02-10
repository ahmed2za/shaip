import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Rating,
  Avatar,
  Tooltip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Reply as ReplyIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/Layout';

interface Review {
  id: string;
  rating: number;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  companyId: string;
  companyName: string;
  language: string;
  purchaseVerified: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  replies: Reply[];
  helpful: number;
  reported: boolean;
  ipAddress: string;
}

interface Reply {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  companyId: string;
  text: string;
  createdAt: string;
}

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: '1',
    rating: 4,
    text: 'خدمة ممتازة وسرعة في التنفيذ',
    userId: '1',
    userName: 'أحمد محمد',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    companyId: '1',
    companyName: 'شركة التقنية المتقدمة',
    language: 'ar',
    purchaseVerified: true,
    createdAt: '2025-02-08',
    status: 'approved',
    replies: [
      {
        id: '1',
        reviewId: '1',
        userId: '2',
        userName: 'شركة التقنية المتقدمة',
        companyId: '1',
        text: 'شكراً لتقييمكم الإيجابي',
        createdAt: '2025-02-09',
      },
    ],
    helpful: 5,
    reported: false,
    ipAddress: '192.168.1.1',
  },
  {
    id: '2',
    rating: 2,
    text: 'الخدمة بطيئة وتحتاج تحسين',
    userId: '3',
    userName: 'محمد علي',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    companyId: '2',
    companyName: 'شركة الحلول الذكية',
    language: 'ar',
    purchaseVerified: false,
    createdAt: '2025-02-07',
    status: 'pending',
    replies: [],
    helpful: 2,
    reported: true,
    ipAddress: '192.168.1.2',
  },
];

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    total: reviews.length,
    approved: reviews.filter((review) => review.status === 'approved').length,
    pending: reviews.filter((review) => review.status === 'pending').length,
    rejected: reviews.filter((review) => review.status === 'rejected').length,
    reported: reviews.filter((review) => review.reported).length,
    verified: reviews.filter((review) => review.purchaseVerified).length,
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenReplyDialog = (review: Review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const handleSaveReply = () => {
    if (selectedReview && replyText) {
      const newReply: Reply = {
        id: String(Date.now()),
        reviewId: selectedReview.id,
        userId: '2', // Company ID
        userName: selectedReview.companyName,
        companyId: selectedReview.companyId,
        text: replyText,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === selectedReview.id
            ? {
                ...review,
                replies: [...review.replies, newReply],
              }
            : review
        )
      );

      handleCloseDialog();
    }
  };

  const handleUpdateStatus = (reviewId: string, status: Review['status']) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId ? { ...review, status } : review
      )
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || review.status === filterStatus;
    const matchesVerified =
      filterVerified === 'all' ||
      (filterVerified === 'verified' && review.purchaseVerified) ||
      (filterVerified === 'unverified' && !review.purchaseVerified);
    return matchesSearch && matchesStatus && matchesVerified;
  });

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          إدارة المراجعات
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  إجمالي المراجعات
                </Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  المعتمدة
                </Typography>
                <Typography variant="h4" sx={{ color: 'success.main' }}>
                  {stats.approved}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  قيد المراجعة
                </Typography>
                <Typography variant="h4" sx={{ color: 'warning.main' }}>
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  المرفوضة
                </Typography>
                <Typography variant="h4" sx={{ color: 'error.main' }}>
                  {stats.rejected}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  المبلغ عنها
                </Typography>
                <Typography variant="h4" color="error">
                  {stats.reported}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  مؤكدة الشراء
                </Typography>
                <Typography variant="h4" sx={{ color: 'success.main' }}>
                  {stats.verified}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="بحث في المراجعات"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>الحالة</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="الحالة"
                >
                  <MenuItem value="all">الكل</MenuItem>
                  <MenuItem value="approved">معتمدة</MenuItem>
                  <MenuItem value="pending">قيد المراجعة</MenuItem>
                  <MenuItem value="rejected">مرفوضة</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>التحقق من الشراء</InputLabel>
                <Select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  label="التحقق من الشراء"
                >
                  <MenuItem value="all">الكل</MenuItem>
                  <MenuItem value="verified">مؤكد</MenuItem>
                  <MenuItem value="unverified">غير مؤكد</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Reviews List */}
        <Stack spacing={2}>
          {filteredReviews
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((review) => (
              <Paper key={review.id} sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={review.userAvatar}
                          alt={review.userName}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {review.userName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {review.companyName}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        {review.purchaseVerified && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="مؤكد الشراء"
                            color="success"
                            size="small"
                          />
                        )}
                        <Chip
                          label={
                            review.status === 'approved'
                              ? 'معتمدة'
                              : review.status === 'pending'
                              ? 'قيد المراجعة'
                              : 'مرفوضة'
                          }
                          color={
                            review.status === 'approved'
                              ? 'success'
                              : review.status === 'pending'
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                        {review.reported && (
                          <Chip
                            icon={<FlagIcon />}
                            label="مبلغ عنها"
                            color="error"
                            size="small"
                          />
                        )}
                      </Stack>
                    </Stack>

                    <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {review.text}
                    </Typography>

                    {review.replies.length > 0 && (
                      <Box sx={{ pl: 4, mb: 2 }}>
                        {review.replies.map((reply) => (
                          <Paper
                            key={reply.id}
                            sx={{ p: 2, bgcolor: 'grey.50', mb: 1 }}
                          >
                            <Typography variant="subtitle2" gutterBottom>
                              {reply.userName}
                            </Typography>
                            <Typography variant="body2">{reply.text}</Typography>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mt: 1, display: 'block' }}
                            >
                              {reply.createdAt}
                            </Typography>
                          </Paper>
                        ))}
                      </Box>
                    )}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" color="textSecondary">
                        {review.createdAt}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="رد">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenReplyDialog(review)}
                          >
                            <ReplyIcon />
                          </IconButton>
                        </Tooltip>
                        {review.status === 'pending' && (
                          <>
                            <Tooltip title="قبول">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleUpdateStatus(review.id, 'approved')
                                }
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="رفض">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleUpdateStatus(review.id, 'rejected')
                                }
                              >
                                <BlockIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="حذف">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            ))}
        </Stack>

        <TablePagination
          component="div"
          count={filteredReviews.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="عدد المراجعات في الصفحة"
        />
      </Box>

      {/* Reply Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>الرد على المراجعة</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <>
              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  المراجعة الأصلية:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2">{selectedReview.text}</Typography>
                </Paper>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="نص الرد"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button
            onClick={handleSaveReply}
            variant="contained"
            disabled={!replyText}
          >
            إرسال الرد
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
