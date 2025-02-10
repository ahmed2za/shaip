import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Typography,
  Alert,
  Rating,
  Chip,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    email: string;
  };
  company: {
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const ReviewsManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError('Failed to fetch reviews');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setSuccess(`تم ${status === 'approved' ? 'قبول' : 'رفض'} التقييم بنجاح`);
      fetchReviews();
    } catch (err) {
      setError('Failed to update review status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      try {
        await fetch(`/api/admin/reviews/${id}`, {
          method: 'DELETE',
        });
        setSuccess('تم حذف التقييم بنجاح');
        fetchReviews();
      } catch (err) {
        setError('Failed to delete review');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'قيد المراجعة';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        إدارة التقييمات
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>المستخدم</TableCell>
              <TableCell>الشركة</TableCell>
              <TableCell>التقييم</TableCell>
              <TableCell>التعليق</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((review) => (
                <TableRow key={review._id}>
                  <TableCell>
                    <Typography variant="body2">{review.user.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {review.user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{review.company.name}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly />
                  </TableCell>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(review.status)}
                      color={getStatusColor(review.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {review.status === 'pending' && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => handleStatusChange(review._id, 'approved')}
                        >
                          <ApproveIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleStatusChange(review._id, 'rejected')}
                        >
                          <RejectIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton onClick={() => handleDelete(review._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default ReviewsManager;
