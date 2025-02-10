import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

interface Ad {
  _id: string;
  title: string;
  type: string;
  status: string;
  companyId: {
    name: string;
    _id: string;
  };
  startDate: string;
  endDate: string;
  views: number;
  clicks: number;
}

export default function AdsManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    fetchAds();
  }, [page, rowsPerPage]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/admin/ads?page=${page + 1}&limit=${rowsPerPage}`);
      const data = await response.json();
      setAds(data.ads);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ads');
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (adId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/ads/${adId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminComment })
      });

      if (response.ok) {
        fetchAds();
        setDialogOpen(false);
        setAdminComment('');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      setError('Failed to update ad status');
    }
  };

  const handleViewDetails = (ad: Ad) => {
    setSelectedAd(ad);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'expired':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>إدارة الإعلانات</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العنوان</TableCell>
              <TableCell>الشركة</TableCell>
              <TableCell>النوع</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>المشاهدات</TableCell>
              <TableCell>النقرات</TableCell>
              <TableCell>تاريخ البداية</TableCell>
              <TableCell>تاريخ النهاية</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad._id}>
                <TableCell>{ad.title}</TableCell>
                <TableCell>{ad.companyId.name}</TableCell>
                <TableCell>{ad.type}</TableCell>
                <TableCell>
                  <Chip
                    label={ad.status}
                    color={getStatusColor(ad.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{ad.views}</TableCell>
                <TableCell>{ad.clicks}</TableCell>
                <TableCell>{new Date(ad.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(ad.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(ad)}
                    title="عرض التفاصيل"
                  >
                    <ViewIcon />
                  </IconButton>
                  {ad.status === 'pending' && (
                    <>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(ad._id, 'active')}
                        title="موافقة"
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleStatusChange(ad._id, 'rejected')}
                        title="رفض"
                      >
                        <RejectIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={ads.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="عدد العناصر في الصفحة"
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedAd && (
          <>
            <DialogTitle>تفاصيل الإعلان</DialogTitle>
            <DialogContent>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{selectedAd.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  شركة: {selectedAd.companyId.name}
                </Typography>

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)', mb: 3 }}>
                  <Box>
                    <Typography variant="subtitle2">النوع</Typography>
                    <Typography>{selectedAd.type}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">الحالة</Typography>
                    <Chip
                      label={selectedAd.status}
                      color={getStatusColor(selectedAd.status) as any}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">المشاهدات</Typography>
                    <Typography>{selectedAd.views}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">النقرات</Typography>
                    <Typography>{selectedAd.clicks}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">تاريخ البداية</Typography>
                    <Typography>{new Date(selectedAd.startDate).toLocaleDateString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">تاريخ النهاية</Typography>
                    <Typography>{new Date(selectedAd.endDate).toLocaleDateString()}</Typography>
                  </Box>
                </Box>

                {selectedAd.status === 'pending' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="ملاحظات الإدارة"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>إغلاق</Button>
              {selectedAd.status === 'pending' && (
                <>
                  <Button
                    color="error"
                    onClick={() => handleStatusChange(selectedAd._id, 'rejected')}
                  >
                    رفض
                  </Button>
                  <Button
                    color="success"
                    onClick={() => handleStatusChange(selectedAd._id, 'active')}
                  >
                    موافقة
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
}
