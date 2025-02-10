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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface Advertisement {
  _id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  position: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdManager() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    url: '',
    position: 'sidebar',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/company/ads');
      const data = await response.json();
      setAds(data);
    } catch (err) {
      setError('Failed to fetch advertisements');
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/company/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          image: data.url
        }));
        setSuccess('تم رفع الصورة بنجاح');
      } catch (err) {
        setError('Failed to upload image');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const handleEdit = (ad: Advertisement) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      image: ad.image,
      url: ad.url,
      position: ad.position,
      startDate: ad.startDate.split('T')[0],
      endDate: ad.endDate.split('T')[0],
      isActive: ad.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      try {
        await fetch(`/api/company/ads/${id}`, {
          method: 'DELETE',
        });
        setSuccess('تم حذف الإعلان بنجاح');
        fetchAds();
      } catch (err) {
        setError('Failed to delete advertisement');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAd) {
        // Update existing ad
        await fetch(`/api/company/ads/${selectedAd._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم تحديث الإعلان بنجاح');
      } else {
        // Create new ad
        await fetch('/api/company/ads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSuccess('تم إضافة الإعلان بنجاح');
      }
      setDialogOpen(false);
      setSelectedAd(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        url: '',
        position: 'sidebar',
        startDate: '',
        endDate: '',
        isActive: true,
      });
      fetchAds();
    } catch (err) {
      setError('Failed to save advertisement');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">إدارة الإعلانات</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedAd(null);
            setFormData({
              title: '',
              description: '',
              image: '',
              url: '',
              position: 'sidebar',
              startDate: '',
              endDate: '',
              isActive: true,
            });
            setDialogOpen(true);
          }}
        >
          إضافة إعلان
        </Button>
      </Box>

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

      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid item xs={12} md={6} lg={4} key={ad._id}>
            <Card>
              {ad.image && (
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <img
                    src={ad.image}
                    alt={ad.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {ad.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {ad.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  الموقع: {ad.position}
                </Typography>
                <Typography variant="caption" display="block">
                  من: {new Date(ad.startDate).toLocaleDateString()} إلى:{' '}
                  {new Date(ad.endDate).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="caption"
                  color={ad.isActive ? 'success.main' : 'error.main'}
                >
                  {ad.isActive ? 'نشط' : 'غير نشط'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(ad)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(ad._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedAd ? 'تعديل إعلان' : 'إضافة إعلان جديد'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="عنوان الإعلان"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="وصف الإعلان"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    {...getRootProps()}
                    sx={{
                      p: 2,
                      border: '2px dashed #ccc',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <input {...getInputProps()} />
                    <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>
                      اسحب وأفلت الصورة هنا، أو انقر للاختيار
                    </Typography>
                    {formData.image && (
                      <Box sx={{ mt: 2 }}>
                        <img
                          src={formData.image}
                          alt="Preview"
                          style={{ maxWidth: '100%', maxHeight: 200 }}
                        />
                      </Box>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="رابط الإعلان"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>موقع الإعلان</InputLabel>
                    <Select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    >
                      <MenuItem value="sidebar">الشريط الجانبي</MenuItem>
                      <MenuItem value="header">أعلى الصفحة</MenuItem>
                      <MenuItem value="footer">أسفل الصفحة</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="تاريخ البداية"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="تاريخ النهاية"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                    }
                    label="نشط"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">
              {selectedAd ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
