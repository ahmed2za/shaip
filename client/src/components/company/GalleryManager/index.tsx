import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface Image {
  _id: string;
  url: string;
  title: string;
  description: string;
  order: number;
}

export default function GalleryManager() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/company/gallery');
      const data = await response.json();
      setImages(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch images');
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFormData(prev => ({
      ...prev,
      file
    }));
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
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.file) {
        formDataToSend.append('image', formData.file);
      }

      if (selectedImage) {
        // Update existing image
        await fetch(`/api/company/gallery/${selectedImage._id}`, {
          method: 'PUT',
          body: formDataToSend
        });
      } else {
        // Upload new image
        await fetch('/api/company/gallery', {
          method: 'POST',
          body: formDataToSend
        });
      }

      setDialogOpen(false);
      setSelectedImage(null);
      setFormData({
        title: '',
        description: '',
        file: null
      });
      fetchImages();
    } catch (err) {
      setError('Failed to save image');
    }
  };

  const handleDelete = async (imageId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      try {
        await fetch(`/api/company/gallery/${imageId}`, {
          method: 'DELETE'
        });
        fetchImages();
      } catch (err) {
        setError('Failed to delete image');
      }
    }
  };

  const handleEdit = (image: Image) => {
    setSelectedImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      file: null
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">معرض الصور</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedImage(null);
            setFormData({
              title: '',
              description: '',
              file: null
            });
            setDialogOpen(true);
          }}
        >
          إضافة صورة
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.url}
                alt={image.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {image.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {image.description}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(image)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(image._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedImage ? 'تعديل صورة' : 'إضافة صورة جديدة'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                label="عنوان الصورة"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="وصف الصورة"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Paper
                {...getRootProps()}
                sx={{
                  p: 2,
                  border: '2px dashed #ccc',
                  textAlign: 'center',
                  cursor: 'pointer',
                  mb: 2
                }}
              >
                <input {...getInputProps()} />
                <CameraIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography>
                  اسحب وأفلت الصورة هنا، أو انقر للاختيار
                </Typography>
                {formData.file && (
                  <Typography variant="caption" display="block">
                    تم اختيار: {formData.file.name}
                  </Typography>
                )}
              </Paper>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Box sx={{ width: '100%', mb: 2 }}>
                  <CircularProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">
              {selectedImage ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
