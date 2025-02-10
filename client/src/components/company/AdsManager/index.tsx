import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface Ad {
  _id: string;
  title: string;
  content: string;
  type: string;
  image?: string;
  url?: string;
  status: string;
  startDate: string;
  endDate: string;
  views: number;
  clicks: number;
}

export default function CompanyAdsManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '',
    url: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    image: ''
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/company/ads');
      const data = await response.json();
      setAds(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ads');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/company/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchAds();
        setDialogOpen(false);
        setFormData({
          title: '',
          content: '',
          type: '',
          url: '',
          startDate: null,
          endDate: null,
          image: ''
        });
      } else {
        throw new Error('Failed to create ad');
      }
    } catch (err) {
      setError('Failed to create ad');
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">إدارة الإعلانات</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          إعلان جديد
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid item xs={12} md={6} lg={4} key={ad._id}>
            <Card>
              {ad.image && (
                <Box
                  component="img"
                  src={ad.image}
                  alt={ad.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {ad.title}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={ad.status}
                    color={getStatusColor(ad.status) as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip label={ad.type} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {ad.content}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">المشاهدات</Typography>
                    <Typography>{ad.views}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">النقرات</Typography>
                    <Typography>{ad.clicks}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setSelectedAd(ad);
                    setFormData({
                      title: ad.title,
                      content: ad.content,
                      type: ad.type,
                      url: ad.url || '',
                      startDate: new Date(ad.startDate),
                      endDate: new Date(ad.endDate),
                      image: ad.image || ''
                    });
                    setDialogOpen(true);
                  }}
                >
                  تعديل
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedAd ? 'تعديل إعلان' : 'إعلان جديد'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="عنوان الإعلان"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="محتوى الإعلان"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>نوع الإعلان</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange as any}
                    >
                      <MenuItem value="banner">بانر</MenuItem>
                      <MenuItem value="sidebar">شريط جانبي</MenuItem>
                      <MenuItem value="popup">نافذة منبثقة</MenuItem>
                      <MenuItem value="featured">مميز</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="رابط الإعلان"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="تاريخ البداية"
                      value={formData.startDate}
                      onChange={(newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          startDate: newValue
                        }));
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="تاريخ النهاية"
                      value={formData.endDate}
                      onChange={(newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          endDate: newValue
                        }));
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    {...getRootProps()}
                    sx={{
                      p: 2,
                      border: '2px dashed #ccc',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <input {...getInputProps()} />
                    {formData.image ? (
                      <Box
                        component="img"
                        src={formData.image}
                        alt="Preview"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <Typography>اسحب وأفلت صورة الإعلان هنا، أو انقر للاختيار</Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">
              {selectedAd ? 'تحديث' : 'إنشاء'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
