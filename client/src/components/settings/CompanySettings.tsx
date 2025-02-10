import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useDropzone } from 'react-dropzone';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import type { Company } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface CompanySettingsProps {
  company: Company;
  onSave: (updatedCompany: Partial<Company>) => Promise<void>;
}

export default function CompanySettings({ company, onSave }: CompanySettingsProps) {
  const [formData, setFormData] = useState<Partial<Company>>({
    ...company,
  });
  const [newService, setNewService] = useState('');

  const handleInputChange = (field: keyof Company, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      handleInputChange('location', {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData((prev) => ({
        ...prev,
        services: [...(prev.services || []), newService.trim()],
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index),
    }));
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'company_logos'); // Configure in Cloudinary

      const response = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      handleInputChange('logo', data.secure_url);
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom align="right">
        إعدادات الشركة
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Logo Upload */}
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center' }}>
              <Box {...getRootProps()} sx={{ cursor: 'pointer' }}>
                <input {...getInputProps()} />
                <Avatar
                  src={formData.logo || '/images/company-placeholder.png'}
                  alt={formData.name}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                />
                <Typography color="textSecondary">انقر أو اسحب لتغيير الشعار</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="اسم الشركة"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="وصف الشركة"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              dir="rtl"
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="رقم الهاتف"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="الموقع الإلكتروني"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              dir="rtl"
            />
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="العنوان"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12}>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={formData.location || { lat: 24.7136, lng: 46.6753 }} // Default to Riyadh
                zoom={13}
                onClick={handleMapClick}
              >
                {formData.location && <Marker position={formData.location} />}
              </GoogleMap>
            </LoadScript>
          </Grid>

          {/* Services */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom align="right">
              الخدمات
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="أضف خدمة جديدة"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                dir="rtl"
              />
              <Button
                variant="contained"
                onClick={handleAddService}
                startIcon={<AddIcon />}
              >
                إضافة
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.services?.map((service, index) => (
                <Chip
                  key={index}
                  label={service}
                  onDelete={() => handleRemoveService(index)}
                  sx={{ direction: 'rtl' }}
                />
              ))}
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="فيسبوك"
              value={formData.socialMedia?.facebook || ''}
              onChange={(e) =>
                handleInputChange('socialMedia', {
                  ...formData.socialMedia,
                  facebook: e.target.value,
                })
              }
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="تويتر"
              value={formData.socialMedia?.twitter || ''}
              onChange={(e) =>
                handleInputChange('socialMedia', {
                  ...formData.socialMedia,
                  twitter: e.target.value,
                })
              }
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              حفظ التغييرات
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
